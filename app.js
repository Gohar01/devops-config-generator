// DevOpsForge Configuration Generator Logic

// 1. Initial State
const state = {
  frontend: "none",
  backend: "none",
  database: "none",
  proxy: "none",
  appPort: 3000,
  dbPort: 5432,
  env: "development",
  multistage: true,
  backup: false,
  health: false,
  activeTab: "docker-compose.yml"
};

// 2. DOM Elements Cache
const DOM = {
  form: document.getElementById("configurator-form"),
  activeFilename: document.getElementById("active-filename-title"),
  tabsContainer: document.getElementById("tabs-container"),
  lineNumbersContainer: document.getElementById("line-numbers-container"),
  codeOutputContainer: document.getElementById("code-output-container"),
  composeRunCmd: document.getElementById("compose-run-cmd"),
  copyCodeBtn: document.getElementById("copy-code-btn"),
  copyCmdBtn: document.getElementById("copy-cmd-btn"),
  downloadBundleBtn: document.getElementById("download-bundle-btn"),
  
  // Inputs
  appPortInput: document.getElementById("input-app-port"),
  dbPortInput: document.getElementById("input-db-port"),
  envSelect: document.getElementById("select-env"),
  multistageCheck: document.getElementById("check-multistage"),
  backupCheck: document.getElementById("check-backup"),
  healthCheck: document.getElementById("check-health")
};

// 3. Configuration Generation Templates
const generator = {
  // Docker Compose Generator
  "docker-compose.yml": () => {
    let out = `version: '3.8'\n\nservices:\n`;
    const indent = "  ";
    
    // Add Frontend Service
    if (state.frontend !== "none") {
      out += `${indent}frontend:\n`;
      out += `${indent}${indent}build:\n`;
      out += `${indent}${indent}${indent}context: ./frontend\n`;
      out += `${indent}${indent}${indent}dockerfile: Dockerfile\n`;
      
      if (state.env === "development") {
        out += `${indent}${indent}volumes:\n`;
        out += `${indent}${indent}${indent}- ./frontend:/app\n`;
        out += `${indent}${indent}${indent}- /app/node_modules\n`;
        out += `${indent}${indent}environment:\n`;
        out += `${indent}${indent}${indent}- NODE_ENV=development\n`;
      } else {
        out += `${indent}${indent}environment:\n`;
        out += `${indent}${indent}${indent}- NODE_ENV=production\n`;
      }
      
      // If we don't have a proxy, expose frontend port directly to host
      if (state.proxy === "none") {
        out += `${indent}${indent}ports:\n`;
        out += `${indent}${indent}${indent}- "${state.appPort}:80"\n`;
      }
      
      if (state.backend !== "none") {
        out += `${indent}${indent}depends_on:\n`;
        out += `${indent}${indent}${indent}- backend\n`;
      }
      
      if (state.health) {
        out += `${indent}${indent}healthcheck:\n`;
        out += `${indent}${indent}${indent}test: ["CMD", "wget", "--spider", "-q", "http://localhost:80/"]\n`;
        out += `${indent}${indent}${indent}interval: 30s\n`;
        out += `${indent}${indent}${indent}timeout: 10s\n`;
        out += `${indent}${indent}${indent}retries: 3\n`;
      }
      out += `\n`;
    }
    
    // Add Backend Service
    if (state.backend !== "none") {
      out += `${indent}backend:\n`;
      out += `${indent}${indent}build:\n`;
      out += `${indent}${indent}${indent}context: ./backend\n`;
      out += `${indent}${indent}${indent}dockerfile: Dockerfile\n`;
      
      if (state.env === "development") {
        out += `${indent}${indent}volumes:\n`;
        out += `${indent}${indent}${indent}- ./backend:/app\n`;
        // Exclude internal build dependency folders from overriding
        if (state.backend === "node") {
          out += `${indent}${indent}${indent}- /app/node_modules\n`;
        }
      }
      
      out += `${indent}${indent}environment:\n`;
      out += `${indent}${indent}${indent}- PORT=8080\n`;
      out += `${indent}${indent}${indent}- ENV=${state.env}\n`;
      
      if (state.database === "postgres") {
        out += `${indent}${indent}${indent}- DATABASE_URL=postgresql://db_user:db_password@database:${state.dbPort}/db_app\n`;
      } else if (state.database === "mongodb") {
        out += `${indent}${indent}${indent}- MONGO_URI=mongodb://database:27017/db_app\n`;
      } else if (state.database === "redis") {
        out += `${indent}${indent}${indent}- REDIS_URL=redis://redis:6379\n`;
      }
      
      // If we don't have a proxy and there is no frontend, expose backend port directly
      if (state.proxy === "none" && state.frontend === "none") {
        out += `${indent}${indent}ports:\n`;
        out += `${indent}${indent}${indent}- "${state.appPort}:8080"\n`;
      }
      
      if (state.database !== "none") {
        out += `${indent}${indent}depends_on:\n`;
        out += `${indent}${indent}${indent}- database\n`;
      }
      
      if (state.health) {
        out += `${indent}${indent}healthcheck:\n`;
        if (state.backend === "python") {
          out += `${indent}${indent}${indent}test: ["CMD", "curl", "-f", "http://localhost:8080/health"]\n`;
        } else {
          out += `${indent}${indent}${indent}test: ["CMD", "wget", "--spider", "-q", "http://localhost:8080/health"]\n`;
        }
        out += `${indent}${indent}${indent}interval: 30s\n`;
        out += `${indent}${indent}${indent}timeout: 5s\n`;
        out += `${indent}${indent}${indent}retries: 3\n`;
      }
      out += `\n`;
    }
    
    // Add Database Service
    if (state.database !== "none" && state.database !== "redis") {
      out += `${indent}database:\n`;
      if (state.database === "postgres") {
        out += `${indent}${indent}image: postgres:15-alpine\n`;
        out += `${indent}${indent}environment:\n`;
        out += `${indent}${indent}${indent}- POSTGRES_USER=db_user\n`;
        out += `${indent}${indent}${indent}- POSTGRES_PASSWORD=db_password\n`;
        out += `${indent}${indent}${indent}- POSTGRES_DB=db_app\n`;
        out += `${indent}${indent}ports:\n`;
        out += `${indent}${indent}${indent}- "${state.dbPort}:5432"\n`;
        out += `${indent}${indent}volumes:\n`;
        out += `${indent}${indent}${indent}- pgdata:/var/lib/postgresql/data\n`;
      } else if (state.database === "mongodb") {
        out += `${indent}${indent}image: mongo:6.0-alpine\n`;
        out += `${indent}${indent}environment:\n`;
        out += `${indent}${indent}${indent}- MONGO_INITDB_ROOT_USERNAME=db_user\n`;
        out += `${indent}${indent}${indent}- MONGO_INITDB_ROOT_PASSWORD=db_password\n`;
        out += `${indent}${indent}ports:\n`;
        out += `${indent}${indent}${indent}- "${state.dbPort}:27017"\n`;
        out += `${indent}${indent}volumes:\n`;
        out += `${indent}${indent}${indent}- mongodata:/data/db\n`;
      } else if (state.database === "mysql") {
        out += `${indent}${indent}image: mysql:8.0-debian\n`;
        out += `${indent}${indent}environment:\n`;
        out += `${indent}${indent}${indent}- MYSQL_ROOT_PASSWORD=root_password\n`;
        out += `${indent}${indent}${indent}- MYSQL_USER=db_user\n`;
        out += `${indent}${indent}${indent}- MYSQL_PASSWORD=db_password\n`;
        out += `${indent}${indent}${indent}- MYSQL_DATABASE=db_app\n`;
        out += `${indent}${indent}ports:\n`;
        out += `${indent}${indent}${indent}- "${state.dbPort}:3306"\n`;
        out += `${indent}${indent}volumes:\n`;
        out += `${indent}${indent}${indent}- mysqldata:/var/lib/mysql\n`;
      }
      out += `\n`;
    }
    
    // Add Redis Cache Service
    if (state.database === "redis") {
      out += `${indent}redis:\n`;
      out += `${indent}${indent}image: redis:7.0-alpine\n`;
      out += `${indent}${indent}ports:\n`;
      out += `${indent}${indent}${indent}- "${state.dbPort}:6379"\n`;
      out += `${indent}${indent}volumes:\n`;
      out += `${indent}${indent}${indent}- redisdata:/data\n`;
      out += `\n`;
    }
    
    // Add Web Server / Reverse Proxy Service
    if (state.proxy !== "none") {
      out += `${indent}proxy:\n`;
      if (state.proxy === "nginx") {
        out += `${indent}${indent}image: nginx:1.25-alpine\n`;
        out += `${indent}${indent}ports:\n`;
        out += `${indent}${indent}${indent}- "${state.appPort}:80"\n`;
        out += `${indent}${indent}${indent}- "443:443"\n`;
        out += `${indent}${indent}volumes:\n`;
        out += `${indent}${indent}${indent}- ./proxy/nginx.conf:/etc/nginx/nginx.conf:ro\n`;
        out += `${indent}${indent}${indent}- ./proxy/certs:/etc/nginx/certs:ro\n`;
      } else if (state.proxy === "caddy") {
        out += `${indent}${indent}image: caddy:2-alpine\n`;
        out += `${indent}${indent}ports:\n`;
        out += `${indent}${indent}${indent}- "${state.appPort}:80"\n`;
        out += `${indent}${indent}${indent}- "443:443"\n`;
        out += `${indent}${indent}volumes:\n`;
        out += `${indent}${indent}${indent}- ./proxy/Caddyfile:/etc/caddy/Caddyfile\n`;
        out += `${indent}${indent}${indent}- caddy_data:/data\n`;
        out += `${indent}${indent}${indent}- caddy_config:/config\n`;
      }
      
      // Depends on active services
      out += `${indent}${indent}depends_on:\n`;
      if (state.frontend !== "none") {
        out += `${indent}${indent}${indent}- frontend\n`;
      }
      if (state.backend !== "none") {
        out += `${indent}${indent}${indent}- backend\n`;
      }
      out += `\n`;
    }
    
    // Named volumes definitions
    let hasVolumes = (state.database !== "none") || (state.proxy === "caddy");
    if (hasVolumes) {
      out += `volumes:\n`;
      if (state.database === "postgres") out += `  pgdata:\n`;
      if (state.database === "mongodb") out += `  mongodata:\n`;
      if (state.database === "mysql") out += `  mysqldata:\n`;
      if (state.database === "redis") out += `  redisdata:\n`;
      if (state.proxy === "caddy") {
        out += `  caddy_data:\n`;
        out += `  caddy_config:\n`;
      }
    }
    
    return out;
  },

  // Dockerfile Generator (Unified or Frontend-specific)
  "Dockerfile": () => {
    // If we have both frontend and backend, we will render a Frontend specific Dockerfile here.
    if (state.frontend !== "none") {
      return generator["frontend.Dockerfile"]();
    }
    // If only backend is active, render Backend Dockerfile
    if (state.backend !== "none") {
      return generator["backend.Dockerfile"]();
    }
    
    return `# DevOpsForge Boilerplate Dockerfile\n# Please select a Frontend or Backend framework to generate a Dockerfile.`;
  },

  "frontend.Dockerfile": () => {
    let out = `# --- FRONTEND BUILD STAGE ---\n`;
    
    if (state.frontend === "static") {
      out += `FROM nginx:1.25-alpine\n`;
      out += `COPY . /usr/share/nginx/html\n`;
      out += `EXPOSE 80\n`;
      out += `CMD ["nginx", "-g", "daemon off;"]\n`;
      return out;
    }

    if (state.multistage && state.env === "production") {
      out += `FROM node:18-alpine AS builder\n`;
      out += `WORKDIR /app\n`;
      out += `COPY package*.json ./\n`;
      out += `RUN npm ci --only=production\n`;
      out += `COPY . .\n`;
      out += `RUN npm run build\n\n`;
      
      out += `# --- RUNNER STAGE ---\n`;
      out += `FROM nginx:1.25-alpine\n`;
      out += `COPY --from=builder /app/dist /usr/share/nginx/html\n`;
      out += `COPY nginx.conf /etc/nginx/conf.d/default.conf\n`;
      out += `EXPOSE 80\n`;
      out += `CMD ["nginx", "-g", "daemon off;"]\n`;
    } else {
      out += `FROM node:18-alpine\n`;
      out += `WORKDIR /app\n`;
      out += `COPY package*.json ./\n`;
      out += `RUN npm install\n`;
      out += `COPY . .\n`;
      out += `EXPOSE 3000\n`;
      out += `CMD ["npm", "run", "dev"]\n`;
    }
    return out;
  },

  "backend.Dockerfile": () => {
    let out = `# --- BACKEND BUILD STAGE ---\n`;
    
    if (state.backend === "node") {
      if (state.multistage && state.env === "production") {
        out += `FROM node:18-alpine AS builder\n`;
        out += `WORKDIR /app\n`;
        out += `COPY package*.json ./\n`;
        out += `RUN npm ci\n`;
        out += `COPY . .\n\n`;
        out += `# Production image runner\n`;
        out += `FROM node:18-alpine\n`;
        out += `WORKDIR /app\n`;
        out += `COPY package*.json ./\n`;
        out += `RUN npm ci --only=production\n`;
        out += `COPY --from=builder /app ./\n`;
        out += `EXPOSE 8080\n`;
        out += `CMD ["node", "server.js"]\n`;
      } else {
        out += `FROM node:18-alpine\n`;
        out += `WORKDIR /app\n`;
        out += `COPY package*.json ./\n`;
        out += `RUN npm install\n`;
        out += `COPY . .\n`;
        out += `EXPOSE 8080\n`;
        out += `CMD ["npm", "run", "start"]\n`;
      }
    } else if (state.backend === "python") {
      out += `FROM python:3.10-slim\n`;
      out += `WORKDIR /app\n`;
      out += `ENV PYTHONDONTWRITEBYTECODE=1 \\ \n    PYTHONUNBUFFERED=1\n`;
      out += `COPY requirements.txt ./\n`;
      out += `RUN pip install --no-cache-dir -r requirements.txt\n`;
      out += `COPY . .\n`;
      out += `EXPOSE 8080\n`;
      out += `CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8080"]\n`;
    } else if (state.backend === "go") {
      if (state.multistage && state.env === "production") {
        out += `FROM golang:1.20-alpine AS builder\n`;
        out += `WORKDIR /app\n`;
        out += `COPY go.mod go.sum ./\n`;
        out += `RUN go mod download\n`;
        out += `COPY . .\n`;
        out += `RUN CGO_ENABLED=0 GOOS=linux go build -o main .\n\n`;
        
        out += `# Production runtime runner\n`;
        out += `FROM alpine:latest\n`;
        out += `RUN apk --no-cache add ca-certificates\n`;
        out += `WORKDIR /root/\n`;
        out += `COPY --from=builder /app/main .\n`;
        out += `EXPOSE 8080\n`;
        out += `CMD ["./main"]\n`;
      } else {
        out += `FROM golang:1.20-alpine\n`;
        out += `WORKDIR /app\n`;
        out += `COPY go.mod go.sum ./\n`;
        out += `RUN go mod download\n`;
        out += `COPY . .\n`;
        out += `EXPOSE 8080\n`;
        out += `CMD ["go", "run", "main.go"]\n`;
      }
    }
    
    return out;
  },

  // Nginx reverse proxy configuration
  "nginx.conf": () => {
    let out = `events {\n    worker_connections 1024;\n}\n\nhttp {\n`;
    out += `    upstream frontend_server {\n        server frontend:80;\n    }\n\n`;
    
    if (state.backend !== "none") {
      out += `    upstream backend_server {\n        server backend:8080;\n    }\n\n`;
    }
    
    out += `    server {\n        listen 80;\n        server_name localhost;\n\n`;
    
    // API redirection location
    if (state.backend !== "none") {
      out += `        location /api/ {\n`;
      out += `            proxy_pass http://backend_server/;\n`;
      out += `            proxy_set_header Host $host;\n`;
      out += `            proxy_set_header X-Real-IP $remote_addr;\n`;
      out += `            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;\n`;
      out += `            proxy_set_header X-Forwarded-Proto $scheme;\n`;
      out += `        }\n\n`;
    }
    
    // Frontend static / route location
    out += `        location / {\n`;
    if (state.frontend !== "none") {
      out += `            proxy_pass http://frontend_server;\n`;
    } else {
      out += `            root /usr/share/nginx/html;\n`;
      out += `            index index.html;\n`;
    }
    out += `            proxy_set_header Host $host;\n`;
    out += `            proxy_set_header X-Real-IP $remote_addr;\n`;
    out += `        }\n`;
    
    out += `    }\n`;
    out += `}\n`;
    return out;
  },

  // Caddy Server file configuration
  "Caddyfile": () => {
    let out = `localhost {\n`;
    
    if (state.backend !== "none") {
      out += `    # Proxy API calls directly to the backend container\n`;
      out += `    reverse_proxy /api/* backend:8080\n\n`;
    }
    
    if (state.frontend !== "none") {
      out += `    # Proxy regular routes to the static UI server\n`;
      out += `    reverse_proxy /* frontend:80\n`;
    } else {
      out += `    # Serve raw static files locally\n`;
      out += `    file_server\n`;
    }
    
    out += `}\n`;
    return out;
  },

  // DB Backup Helper Script
  "backup.sh": () => {
    let out = `#!/bin/bash\n`;
    out += `# DevOpsForge Auto-Generated Database Backup Script\n`;
    out += `BACKUP_DIR="./backups"\n`;
    out += `TIMESTAMP=$(date +"%Y%m%d_%H%M%S")\n\n`;
    out += `mkdir -p $BACKUP_DIR\n\n`;
    
    if (state.database === "postgres") {
      out += `echo "Initializing PostgreSQL Database Backup..."\n`;
      out += `docker compose exec -t database pg_dumpall -U db_user > $BACKUP_DIR/db_backup_$TIMESTAMP.sql\n`;
    } else if (state.database === "mongodb") {
      out += `echo "Initializing MongoDB Database Backup..."\n`;
      out += `docker compose exec -t database mongodump --username db_user --password db_password --out=/data/db/backup_$TIMESTAMP\n`;
      out += `docker cp $(docker compose ps -q database):/data/db/backup_$TIMESTAMP $BACKUP_DIR/backup_$TIMESTAMP\n`;
    } else if (state.database === "mysql") {
      out += `echo "Initializing MySQL Database Backup..."\n`;
      out += `docker compose exec -t database mysqldump -u db_user -pdb_password db_app > $BACKUP_DIR/db_backup_$TIMESTAMP.sql\n`;
    } else {
      out += `echo "No database config selected. Backup aborted."\n`;
    }
    
    out += `\necho "Backup completed successfully! Saved to: $BACKUP_DIR"\n`;
    return out;
  },

  // Deployment startup script
  "deploy.sh": () => {
    let out = `#!/bin/bash\n`;
    out += `# Production Build & Deployment Orchestration Script\n\n`;
    out += `echo "Checking prerequisite dependencies..."\n`;
    out += `if ! command -v docker &> /dev/null; then\n`;
    out += `    echo "Error: Docker daemon is not installed. Aborting."\n`;
    out += `    exit 1\n`;
    out += `fi\n\n`;
    
    out += `echo "Stopping running services..."\n`;
    out += `docker compose down --remove-orphans\n\n`;
    
    out += `echo "Orchestrating production build builds..."\n`;
    out += `docker compose build --pull\n\n`;
    
    out += `echo "Spinning up core containers in detached daemon..."\n`;
    out += `docker compose up -d\n\n`;
    
    if (state.backup) {
      out += `# Registering Cron Tab entry for auto-backups (Daily at 02:00)\n`;
      out += `if ! crontab -l | grep -q "backup.sh"; then\n`;
      out += `    (crontab -l 2>/dev/null; echo "0 2 * * * (cd $(pwd) && /bin/bash ./backup.sh)") | crontab -\n`;
      out += `    echo "Cron Job backup registry created successfully!"\n`;
      out += `fi\n\n`;
    }
    
    out += `echo "Deployment pipeline completed successfully!"\n`;
    out += `docker compose ps\n`;
    return out;
  }
};

// 4. Main Tab & Template Orchestration Handler
function renderCodeView() {
  const currentFilename = state.activeTab;
  DOM.activeFilename.textContent = currentFilename;
  
  const content = generator[currentFilename]();
  
  // Custom simple syntax highlighter implementation (HTML entities clean-up + classes)
  const escaped = content
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
    
  // Highlight syntax segments via regular expressions
  let highlighted = escaped
    // Comments (# or //)
    .replace(/(#[^\n]*)/g, '<span class="c-comment">$1</span>')
    .replace(/(\/\/[^\n]*)/g, '<span class="c-comment">$1</span>')
    // Keywords (version, services, build, context, dockerfile, image, ports, volumes, environment, FROM, WORKDIR, RUN, COPY, EXPOSE, CMD)
    .replace(/\b(version|services|build|context|dockerfile|image|ports|volumes|environment|depends_on|healthcheck|test|interval|timeout|retries|upstream|server|listen|server_name|location|proxy_pass|proxy_set_header|file_server|reverse_proxy)\b/g, '<span class="c-keyword">$1</span>')
    .replace(/\b(FROM|WORKDIR|RUN|COPY|EXPOSE|CMD|AS|ENV)\b/g, '<span class="c-keyword">$1</span>')
    .replace(/\b(mkdir|docker|docker-compose|crontab|echo|exit)\b/g, '<span class="c-keyword">$1</span>');
  
  DOM.codeOutputContainer.innerHTML = highlighted;
  
  // Render line numbers
  const linesCount = content.split("\n").length;
  let linesHtml = "";
  for (let i = 1; i <= linesCount; i++) {
    linesHtml += `<span>${i}</span>`;
  }
  DOM.lineNumbersContainer.innerHTML = linesHtml;
  
  // Update Run Command label based on environment
  if (state.env === "production") {
    DOM.composeRunCmd.textContent = "docker compose up -d --build";
  } else {
    DOM.composeRunCmd.textContent = "docker compose up";
  }
}

// 5. Dynamic Tab Switcher Bar Render
function updateDynamicTabs() {
  const tabsList = [];
  
  // Always include compose
  tabsList.push("docker-compose.yml");
  
  // Add Dockerfiles depending on stack selections
  if (state.frontend !== "none" && state.backend !== "none") {
    tabsList.push("frontend.Dockerfile");
    tabsList.push("backend.Dockerfile");
  } else if (state.frontend !== "none") {
    tabsList.push("frontend.Dockerfile");
  } else if (state.backend !== "none") {
    tabsList.push("backend.Dockerfile");
  }
  
  // Proxy configurations
  if (state.proxy === "nginx") {
    tabsList.push("nginx.conf");
  } else if (state.proxy === "caddy") {
    tabsList.push("Caddyfile");
  }
  
  // Backup scripts
  if (state.backup) {
    tabsList.push("backup.sh");
  }
  
  // Deploy orchestration shell script
  tabsList.push("deploy.sh");

  // Validate activeTab is still in the active list. If not, reset activeTab.
  if (!tabsList.includes(state.activeTab)) {
    state.activeTab = tabsList[0];
  }

  // Draw Tab buttons
  DOM.tabsContainer.innerHTML = "";
  tabsList.forEach(tab => {
    const btn = document.createElement("button");
    btn.className = `tab-btn ${tab === state.activeTab ? "active" : ""}`;
    btn.textContent = tab;
    btn.addEventListener("click", () => {
      state.activeTab = tab;
      DOM.tabsContainer.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      renderCodeView();
    });
    DOM.tabsContainer.appendChild(btn);
  });
}

// 6. Config Input Change Listener
function syncInputsToState() {
  // Radio framework selectors
  state.frontend = DOM.form.querySelector('input[name="frontend"]:checked').value;
  state.backend = DOM.form.querySelector('input[name="backend"]:checked').value;
  state.database = DOM.form.querySelector('input[name="database"]:checked').value;
  state.proxy = DOM.form.querySelector('input[name="proxy"]:checked').value;
  
  // Text & numeric inputs
  state.appPort = parseInt(DOM.appPortInput.value) || 3000;
  state.dbPort = parseInt(DOM.dbPortInput.value) || 5432;
  state.env = DOM.envSelect.value;
  
  // Checkboxes
  state.multistage = DOM.multistageCheck.checked;
  state.backup = DOM.backupCheck.checked;
  state.health = DOM.healthCheck.checked;
  
  // Re-generate configs
  updateDynamicTabs();
  renderCodeView();
}

// 7. Utility: Clipboard Operations
function copyTextToClipboard(text) {
  navigator.clipboard.writeText(text).then(() => {
    alert("Copied to clipboard successfully!");
  }).catch(err => {
    console.error("Could not copy text: ", err);
  });
}

// 8. Bundle Download Orchestration
function downloadConfigBundle() {
  // Generate files download list based on current active tabs
  const activeTabsList = [];
  activeTabsList.push("docker-compose.yml");
  if (state.frontend !== "none" && state.backend !== "none") {
    activeTabsList.push("frontend.Dockerfile");
    activeTabsList.push("backend.Dockerfile");
  } else if (state.frontend !== "none") {
    activeTabsList.push("frontend.Dockerfile");
  } else if (state.backend !== "none") {
    activeTabsList.push("backend.Dockerfile");
  }
  if (state.proxy === "nginx") activeTabsList.push("nginx.conf");
  if (state.proxy === "caddy") activeTabsList.push("Caddyfile");
  if (state.backup) activeTabsList.push("backup.sh");
  activeTabsList.push("deploy.sh");

  // Since we want zero dependencies, we will download the configuration files sequentially
  // by creating hidden links and clicking them with a minor delay.
  activeTabsList.forEach((filename, index) => {
    setTimeout(() => {
      // Map file aliases back to standard outputs (e.g. frontend.Dockerfile -> Dockerfile)
      let saveName = filename;
      if (filename === "frontend.Dockerfile" || filename === "backend.Dockerfile") {
        saveName = "Dockerfile";
      }

      const content = generator[filename]();
      const blob = new Blob([content], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = saveName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, index * 250); // minor delay to prevent browser block popup
  });
}

// 9. Attach Listeners & Run On Start
function init() {
  // Listen to configuration form changes
  DOM.form.addEventListener("change", syncInputsToState);
  
  DOM.appPortInput.addEventListener("input", syncInputsToState);
  DOM.dbPortInput.addEventListener("input", syncInputsToState);
  DOM.envSelect.addEventListener("change", syncInputsToState);

  // Copy code content
  DOM.copyCodeBtn.addEventListener("click", () => {
    const text = generator[state.activeTab]();
    copyTextToClipboard(text);
  });

  // Copy run command
  DOM.copyCmdBtn.addEventListener("click", () => {
    const text = DOM.composeRunCmd.textContent;
    copyTextToClipboard(text);
  });

  // Download bundle click
  DOM.downloadBundleBtn.addEventListener("click", downloadConfigBundle);

  // Run initial compile
  syncInputsToState();
}

window.addEventListener("DOMContentLoaded", init);
