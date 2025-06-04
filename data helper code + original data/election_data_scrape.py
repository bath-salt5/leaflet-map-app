import requests
from bs4 import BeautifulSoup
import csv

# def save_html(html, path):
#     with open(path, 'wb') as f:
#         f.write(html)

urls = ['https://www.eld.gov.sg/finalresults2025.html', 'https://www.eld.gov.sg/finalresults2020.html', 
        'https://www.eld.gov.sg/elections_past_parliamentary2015.html', 'https://www.eld.gov.sg/elections_past_parliamentary2011.html',
        'https://www.eld.gov.sg/elections_past_parliamentary2006.html']

files = ["2025_results.csv", "2020_results.csv", "2015_results.csv", "2011_results.csv", "2006_results.csv"]
j = 0
for url in urls:
    r = requests.get(url)
    html_content = r.content

    soup = BeautifulSoup(html_content, 'html.parser')
    constituentcies = soup.select('h3')
    res = soup.select('tbody')

    with open(files[j], "w", newline='', encoding="utf-8") as csvfile:
        writer = csv.writer(csvfile)
        
        # Write CSV headers
        writer.writerow(["Area", "Names", "Party", "Votes", "Percentage"])

        i=0
        for area in constituentcies: 
            for row in res[i].find_all('tr'):
                tds = row.find_all('td')
                
                # Extract names, split by <br> (BeautifulSoup treats them as newlines)
                names = [name.strip() for name in tds[0].stripped_strings]
                names_str = ", ".join(names)

                # Extract party name (it's the text inside <a>)
                party = tds[1].find('a').text.strip()
                
                # Extract votes and percentage
                votes_info = list(tds[2].stripped_strings)
                if len(votes_info) == 2:
                    votes = votes_info[0]
                    percentage = votes_info[1].replace("(", "").replace(")", "")
                else:
                    votes = votes_info[0]
                    percentage = "-"
                
                # print(area.text)
                # print("Names:", names)
                # print("Party:", party)
                # print("Votes:", votes)
                # print("Percentage:", percentage)
                # print("-" * 30)
                writer.writerow([area.text, names_str, party, votes, percentage])
            
            i+=1
    j+=1
# save_html(r.content, '2025_results')
