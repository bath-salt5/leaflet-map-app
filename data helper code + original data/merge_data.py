import csv
import json

# Load election results from CSV
i = 0
results = ['2006_results.csv', '2011_results.csv', '2015_results.csv', '2020_results.csv', '2025_results.csv']
# 
boundaries = ['2006_2.geojson', '2011_2.geojson', '2015_2.geojson', '2020.geojson', '2025.geojson']
# , '2011_2.geojson', '2015_2.geojson', '2020.geojson', '2025.geojson'
for result in results: 
    election_results = {}
    with open(result, newline='', encoding='utf-8') as csvfile:
        reader = csv.DictReader(csvfile)
        for row in reader:
            area = row['Area'].strip().upper()
            party = row['Party'].strip()
            votes = row['Votes'].replace(',', '').strip()
            percentage = row['Percentage'].replace('%', '').strip()
            people = row['Names'].strip()

            # Skip uncontested or invalid entries
            if votes.lower() == 'uncontested' or not votes.isdigit():
                election_results[area] = {
                    'Winning_Party': party,
                    'Candidate(s)': people,
                    'Votes':0,
                    'Percentage':0,
                    'Status': "Uncontested"
                }
                continue

            votes = int(votes)
            percentage = float(percentage)

            if area not in election_results or votes > election_results[area]['Votes']:
                election_results[area] = {
                    'Winning_Party': party,
                    'Candidate(s)': people,
                    'Votes': votes,
                    'Percentage': percentage,
                    'Status': "Contested"
                }

    # Load GeoJSON
    with open(boundaries[i], 'r', encoding='utf-8') as f:
        geojson_data = json.load(f)

    # Merge election data into GeoJSON
    for feature in geojson_data['features']:
        properties = feature['properties']
        area_name = properties.get('Name', '').strip()
        print(area_name)
        if area_name in election_results:
            properties.update(election_results[area_name])

    # Save the updated GeoJSON
    year = result.split("_")
    filename = year[0] + "_updated.geojson"
    with open(filename, 'w', encoding='utf-8') as f:
        json.dump(geojson_data, f, ensure_ascii=False, indent=2)

    i+=1

