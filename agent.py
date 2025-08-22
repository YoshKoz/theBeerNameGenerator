import os
import subprocess
from langchain_openai import ChatOpenAI
from langchain.agents import initialize_agent, Tool

# Make sure to export OPENAI_API_KEY in your shell environment before running this script.

# Direct execution of Linux commands
def run_cmd(command: str) -> str:
    try:
        result = subprocess.check_output(
            command,
            shell=True,
            stderr=subprocess.STDOUT,
            text=True,
            timeout=60
        )
        return result.strip()
    except subprocess.CalledProcessError as e:
        return f"Command failed ({e.returncode}): {e.output}"
    except Exception as e:
        return f"Error: {str(e)}"

tools = [
    Tool(
        name="Shell",
        func=run_cmd,
        description="Executes Linux shell commands directly without asking. Use for fixing and configuring the system."
    )
]

llm = ChatOpenAI(model="gpt-4.1", temperature=0)

# Initialize autonomous agent
agent = initialize_agent(
    tools,
    llm,
    agent="zero-shot-react-description",
    verbose=True,
    handle_parsing_errors=True
)

# Example: let it diagnose and fix automatically
tasks = [
    "Check disk usage and clean old apt packages if needed",
    "Check if any services are failed and restart them",
    "Update all apt packages and autoremove junk",
]

for t in tasks:
    print("\n=== Running task:", t, "===")
    print(agent.run(t))
