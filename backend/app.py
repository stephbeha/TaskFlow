from flask import Flask, jsonify, request
from flask_cors import CORS
import json
import os
import torch
from transformers import pipeline

app = Flask(__name__)
CORS(app)

DATA_FILE = "tasks_data.json"
MODEL_ID = "HuggingFaceTB/SmolLM2-135M-Instruct"

# --- INITIALISATION IA LOCALE ---
print(f"Loading AI model {MODEL_ID}...")
device = "cuda" if torch.cuda.is_available() else "cpu"
print(f"Device: {device}")
generator = pipeline("text-generation", model=MODEL_ID, device=device)
print("✓ AI Ready!")

# --- LOCAL DATABASE ---
if os.path.exists(DATA_FILE):
    with open(DATA_FILE, "r") as f:
        tasks_db = json.load(f)
else:
    tasks_db = [
        {"id": 1, "title": "Welcome to TaskFlow", "description": "Organize your work efficiently.", "status": "backlog", "priority": "normal", "points": 2, "assignee": "", "labels": []}
    ]

def save_db():
    with open(DATA_FILE, "w") as f:
        json.dump(tasks_db, f, indent=2)

# --- TASK ROUTES ---
@app.route("/api/tasks", methods=["GET"])
def get_tasks():
    return jsonify(tasks_db)

@app.route("/api/tasks", methods=["POST"])
def create_task():
    data = request.json
    new_task = {
        "id": max([t["id"] for t in tasks_db] + [0]) + 1,
        "title": data.get("title", "Untitled Task"),
        "description": data.get("description", ""),
        "status": data.get("status", "backlog"),
        "priority": data.get("priority", "normal"),
        "points": data.get("points", 1),
        "assignee": data.get("assignee", ""),
        "labels": data.get("labels", [])
    }
    tasks_db.append(new_task)
    save_db()
    return jsonify(new_task), 201

@app.route("/api/tasks/<int:task_id>", methods=["PATCH"])
def update_task(task_id):
    data = request.json
    for task in tasks_db:
        if task["id"] == task_id:
            task.update(data)
            save_db()
            return jsonify(task)
    return jsonify({"error": "Not found"}), 404

@app.route("/api/tasks/<int:task_id>", methods=["DELETE"])
def delete_task(task_id):
    global tasks_db
    tasks_db = [t for t in tasks_db if t["id"] != task_id]
    save_db()
    return "", 204

# --- AI SUGGESTION ROUTE ---
@app.route("/api/ai/suggest", methods=["POST"])
def ai_suggest():
    import re
    title = request.json.get("title", "")
    title_lower = title.lower()

    # --- Smart Complexity Estimation ---
    words = len(title.split())
    if any(k in title_lower for k in ["auth", "login", "security", "payment", "encrypt", "database"]):
        suggested_points = 8
    elif any(k in title_lower for k in ["dashboard", "report", "search", "filter", "export", "analytics"]):
        suggested_points = 5
    elif any(k in title_lower for k in ["button", "label", "text", "color", "icon", "typo", "style"]):
        suggested_points = 1
    elif words <= 3:
        suggested_points = 2
    elif words <= 6:
        suggested_points = 3
    else:
        suggested_points = 5

    # --- Priority Detection ---
    priority = "critical" if any(k in title_lower for k in ["urgent", "bug", "fix", "crash", "error", "broken", "critical"]) else "normal"

    # --- AI Description Generation ---
    messages = [
        {"role": "system", "content": f"""You are a Senior Project Manager and Agile Expert. For the task titled "{title}", generate exactly 2 short acceptance criteria.
Each criterion must be one sentence, specific, and testable.
Respond ONLY with 2 lines, each starting with a dash (-). No intro, no explanation."""},
        {"role": "user", "content": title}
    ]
    
    try:
        response = generator(messages, max_new_tokens=150, do_sample=False)
        description = response[0]["generated_text"]
        
        # Try to extract only the AI part (after user message)
        if "<|assistant|>" in description:
            description = description.split("<|assistant|>")[-1].strip()
        elif "##assistant" in description.lower():
            description = description.split("##assistant")[-1].strip()
        else:
            # Remove the system/user messages if present
            description = description.replace(messages[0]["content"], "").replace(title, "").strip()
        
        description = description[:500]  # Limit to 500 chars
    except Exception as e:
        print(f"AI Error: {e}")
        description = f"- Implement the {title.lower()} feature\n- Test and validate the implementation"

    return jsonify({
        "suggested_points": suggested_points,
        "suggested_priority": priority,
        "description": description
    })

# --- HEALTH CHECK ---
@app.route("/api/health", methods=["GET"])
def health():
    return jsonify({"status": "ok", "model": MODEL_ID})

if __name__ == "__main__":
    print("\n" + "="*50)
    print("TaskFlow Backend - Starting on http://localhost:5000")
    print("="*50 + "\n")
    app.run(debug=False, host="0.0.0.0", port=5000)
