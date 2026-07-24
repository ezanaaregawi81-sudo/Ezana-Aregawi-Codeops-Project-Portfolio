taken_usernames = {"alice123": "taken", "bob_builder":"taken", "charlie_brown":"taken"}
def is_taken(username):
        if taken_usernames[username] == "taken":
              return True
        else:
              return False

is_taken = is_taken("bob_builder")

if is_taken == True:
    print("is taken! choose another")
else:
      print("not taken")

action_history = []
def perform_action(action):
    print(f"User did: {action}")
    action_history.append(action)
def undo():
 # We need to remove the most recently added action
 if len(action_history) > 0:
    reverted_action = action_history.pop()
    print(f"Undid: {reverted_action}")

perform_action("Action 1")
perform_action("Action 2")
perform_action("Action 3")
undo()
