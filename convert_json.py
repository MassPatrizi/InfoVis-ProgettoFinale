import json

def convert_json(input_json):
    output_json = {"nodes": [], "links": []}
    game_ids = [game["id"] for game in input_json]
    for game in input_json:
        # Add node for each game
        output_json["nodes"].append({"id": game["id"], "name": game["title"]})
        # Add links for each game
        for fan_liked in game["recommendations"]["fans_liked"]:
            if fan_liked in game_ids:
                output_json["links"].append({"source": game["id"], "target": fan_liked})
    return output_json

# Example usage
with open('dataset.json', 'r') as f:
    input_json = json.load(f)
output_json = convert_json(input_json)
with open('output.json', 'w') as f:
    json.dump(output_json, f, indent=4)
