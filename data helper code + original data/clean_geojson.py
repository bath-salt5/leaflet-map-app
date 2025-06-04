from bs4 import BeautifulSoup
import json

files = ['2006.geojson', '2011.geojson']
#'2015.geojson']
files2 = ['2006_2.geojson', '2011_2.geojson']
#'2015_2.geojson'
i = 0
# Load your GeoJSON data
for file in files:
    with open(file, 'r', encoding='utf-8') as f:
        geojson_data = json.load(f)

    # Process each feature
    for feature in geojson_data['features']:
        description_html = feature['properties'].get('Description', '')
        if description_html:
            soup = BeautifulSoup(description_html, 'html.parser')
            parsed_data = soup.find_all('td')
            code = [tag.get_text(strip=True) for tag in parsed_data]
            # print(code)
            feature['properties'].update({"ED_CODE":code[0], "Name":code[1], "INC_CRC":code[2], "FMEL_UPD_D":code[3]})
            feature['properties'].pop("Description")
            # Merge the parsed data into the feature's properties
            # feature['properties'].update(parsed_data)
            # Optionally, remove the original Description field
            # del feature['properties']['Description']

    # # Save the updated GeoJSON
    with open(files2[i], 'w', encoding='utf-8') as f:
        json.dump(geojson_data, f, ensure_ascii=False, indent=2)
    i+=1
