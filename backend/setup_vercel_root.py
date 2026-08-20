import json

root_pkg = {
  "name": "hiresense-ai",
  "version": "1.0.0",
  "private": True,
  "scripts": {
    "dev": "npm --prefix frontend run dev",
    "build": "npm --prefix frontend install && npm --prefix frontend run build",
    "preview": "npm --prefix frontend run preview"
  }
}

with open("../package.json", "w", encoding="utf-8") as f:
    json.dump(root_pkg, f, indent=2)

vercel_config = {
  "buildCommand": "npm --prefix frontend install && npm --prefix frontend run build",
  "outputDirectory": "frontend/dist",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}

with open("../vercel.json", "w", encoding="utf-8") as f:
    json.dump(vercel_config, f, indent=2)

print("[+] Created root package.json and root vercel.json successfully!")
