// supabase/functions/ai-agent/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"
import { Octokit } from "https://esm.sh/@octokit/rest"

const supabaseUrl = Deno.env.get("SUPABASE_URL")!
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
const openrouterKey = Deno.env.get("OPENROUTER_API_KEY")!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

serve(async (req) => {
  try {
    const { message, app_id } = await req.json()

    if (!message || !app_id) {
      return new Response(JSON.stringify({ error: "message and app_id required" }), { status: 400 })
    }

    // Fetch app context
    const { data: app } = await supabase.from('apps').select('*').eq('id', app_id).single()
    if (!app) throw new Error("App not found")

    // Fetch previous chat history
    const { data: history } = await supabase
      .from('chat_messages')
      .select('role, content')
      .eq('app_id', app_id)
      .order('created_at', { ascending: true })
      .limit(20)

    // Call Claude (best for code reasoning)
    const llmResponse = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${openrouterKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "anthropic/claude-3.5-sonnet",
        messages: [
          {
            role: "system",
            content: `You are an expert full-stack Next.js engineer. 
You help modify an existing app based on user requests.
Current app: ${app.name}
Previous prompt: ${app.prompt || "None"}

Respond with valid JSON only:
{
  "response": "Friendly message to user",
  "updated_code": "Full updated page.tsx content (if changed)",
  "changes_summary": "Brief description of what you changed"
}`
          },
          ...history.map(msg => ({ role: msg.role, content: msg.content })),
          { role: "user", content: message }
        ],
        temperature: 0.7,
        max_tokens: 1200
      })
    })

    const data = await llmResponse.json()
    let aiResult

    try {
      aiResult = JSON.parse(data.choices[0].message.content)
    } catch {
      aiResult = {
        response: "Here's what I suggest...",
        updated_code: null,
        changes_summary: "General improvements"
      }
    }

    // Save user message
    await supabase.from('chat_messages').insert({
      app_id,
      role: "user",
      content: message
    })

    // Save AI response
    await supabase.from('chat_messages').insert({
      app_id,
      role: "assistant",
      content: aiResult.response
    })

    // If AI provided updated code → save it
    if (aiResult.updated_code) {
      await supabase.from('apps').update({
        prompt: aiResult.updated_code, // Store latest code in prompt for simplicity
        updated_at: new Date().toISOString()
      }).eq('id', app_id)
    }

    return new Response(
      JSON.stringify({
        success: true,
        response: aiResult.response,
        changes: aiResult.changes_summary,
        hasCodeUpdate: !!aiResult.updated_code
      }),
      { headers: { "Content-Type": "application/json" } }
    )

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    )
  }
})
