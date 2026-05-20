<!DOCTYPE html>
<html lang="en" data-theme="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Blink Personal • SQLite + Supabase</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.10.0/sql-wasm.min.js"></script>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.6.0/css/all.min.css">
  <style>
    body { font-family: 'Inter', system-ui, sans-serif; }
    .glass { background: rgba(255,255,255,0.05); backdrop-filter: blur(12px); }
  </style>
</head>
<body class="bg-zinc-950 text-zinc-100">

  <nav class="fixed top-0 w-full border-b border-zinc-800 bg-zinc-950/90 backdrop-blur-md z-50">
    <div class="max-w-7xl mx-auto px-6 py-5 flex justify-between items-center">
      <div class="flex items-center gap-3">
        <div class="w-8 h-8 bg-violet-600 rounded-xl flex items-center justify-center font-bold text-xl">B</div>
        <span class="font-semibold text-2xl tracking-tighter">blink<span class="text-violet-400">.</span>new</span>
      </div>
      <button onclick="showDBManager()" class="flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 px-5 py-2 rounded-2xl">
        <i class="fas fa-database"></i> 
        <span id="current-db-name">No Database</span>
      </button>
    </div>
  </nav>

  <div class="max-w-7xl mx-auto px-6 pt-28 pb-12">
    <div class="flex justify-between mb-8">
      <h1 class="text-4xl font-bold">My Projects</h1>
      <button onclick="newProject()" class="bg-violet-600 hover:bg-violet-500 px-6 py-3 rounded-2xl font-medium">+ New Project</button>
    </div>
    <div id="projects-grid" class="grid md:grid-cols-2 lg:grid-cols-3 gap-6"></div>
  </div>

  <!-- Database Manager -->
  <div id="db-manager" class="hidden fixed inset-0 bg-black/80 z-[200] flex items-center justify-center">
    <div class="glass border border-zinc-700 rounded-3xl p-8 w-full max-w-lg">
      <h2 class="text-2xl font-bold mb-6">Database Profiles</h2>
      
      <div onclick="initSQLite()" class="border border-emerald-500 hover:border-emerald-400 rounded-2xl p-6 mb-4 cursor-pointer">
        <div class="flex items-center gap-4">
          <span class="text-4xl">💾</span>
          <div>
            <div class="font-semibold">Local SQLite (Recommended)</div>
            <div class="text-sm text-zinc-400">Fast, private, full SQL power</div>
          </div>
        </div>
      </div>

      <button onclick="hideDBManager()" class="mt-6 w-full py-3 text-zinc-400">Close</button>
    </div>
  </div>

  <script>
    let db = null;           // SQL.js database instance
    let currentDBType = null;

    // Initialize SQLite
    async function initSQLite() {
      hideDBManager();
      currentDBType = 'sqlite';

      document.getElementById('current-db-name').innerHTML = `💾 Local SQLite`;

      // Load SQL.js
      const SQL = await initSqlJs({
        locateFile: file => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.10.0/${file}`
      });

      db = new SQL.Database();

      // Create tables
      db.run(`
        CREATE TABLE IF NOT EXISTS projects (
          id TEXT PRIMARY KEY,
          name TEXT,
          prompt TEXT,
          status TEXT DEFAULT 'draft',
          created_at TEXT
        );
      `);

      alert("✅ Local SQLite Database Initialized Successfully!");
      loadProjects();
    }

    async function newProject() {
      if (!db) return alert("Please connect to a database first");

      const name = prompt("Project Name:", "My New App");
      if (!name) return;

      const id = Date.now().toString();
      db.run("INSERT INTO projects (id, name, status, created_at) VALUES (?, ?, 'draft', ?)", 
        [id, name, new Date().toISOString()]);

      loadProjects();
    }

    function loadProjects() {
      if (!db) return;

      const res = db.exec("SELECT * FROM projects ORDER BY created_at DESC");
      const projects = res[0] ? res[0].values.map(row => ({
        id: row[0],
        name: row[1],
        status: row[3]
      })) : [];

      const container = document.getElementById('projects-grid');
      container.innerHTML = projects.map(p => `
        <div onclick="openProject('${p.id}')" class="glass border border-zinc-700 hover:border-violet-500 rounded-3xl p-6 cursor-pointer transition">
          <h3 class="font-semibold">${p.name}</h3>
          <p class="text-xs text-zinc-500 mt-2">${p.status}</p>
        </div>
      `).join('');
    }

    function openProject(id) {
      alert(`Opened project: ${id}\n\n(Full editor + AI chat would open here)`);
    }

    function showDBManager() {
      document.getElementById('db-manager').classList.remove('hidden');
    }

    function hideDBManager() {
      document.getElementById('db-manager').classList.add('hidden');
    }

    // Initialize
    document.addEventListener('DOMContentLoaded', () => {
      setTimeout(() => {
        if (confirm("Initialize Local SQLite Database?")) {
          initSQLite();
        }
      }, 600);
    });
  </script>
</body>
</html>
