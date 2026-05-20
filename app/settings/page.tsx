"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";

export default function SettingsPage() {
  const [notifications, setNotifications] = useState(true);
  const [marketing, setMarketing] = useState(false);
  const [darkMode, setDarkMode] = useState(true);

  return (
    <div className="min-h-screen bg-zinc-950 p-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-2">Settings</h1>
        <p className="text-zinc-400 mb-10">Manage your preferences and account</p>

        <div className="space-y-8">
          {/* Profile */}
          <Card className="bg-zinc-900 border-zinc-700">
            <CardHeader>
              <CardTitle>Profile</CardTitle>
              <CardDescription>Update your personal information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex gap-6">
                <div className="w-20 h-20 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-2xl flex items-center justify-center text-4xl">👤</div>
                <div className="flex-1 space-y-4">
                  <input type="text" defaultValue="John Doe" className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-5 py-3" />
                  <input type="email" defaultValue="john@example.com" className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-5 py-3" />
                </div>
              </div>
              <Button className="w-full">Save Profile</Button>
            </CardContent>
          </Card>

          {/* Preferences */}
          <Card className="bg-zinc-900 border-zinc-700">
            <CardHeader>
              <CardTitle>Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-medium">Dark Mode</div>
                  <div className="text-sm text-zinc-500">Default theme</div>
                </div>
                <Switch checked={darkMode} onCheckedChange={setDarkMode} />
              </div>

              <div className="flex justify-between items-center">
                <div>
                  <div className="font-medium">Email Notifications</div>
                  <div className="text-sm text-zinc-500">Project updates and AI suggestions</div>
                </div>
                <Switch checked={notifications} onCheckedChange={setNotifications} />
              </div>

              <div className="flex justify-between items-center">
                <div>
                  <div className="font-medium">Marketing Emails</div>
                  <div className="text-sm text-zinc-500">Tips and new features</div>
                </div>
                <Switch checked={marketing} onCheckedChange={setMarketing} />
              </div>
            </CardContent>
          </Card>

          {/* Danger Zone */}
          <Card className="bg-zinc-900 border-red-900/50">
            <CardHeader>
              <CardTitle className="text-red-400">Danger Zone</CardTitle>
            </CardHeader>
            <CardContent>
              <Button variant="destructive" className="w-full bg-red-600 hover:bg-red-700">
                Delete All Projects
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
