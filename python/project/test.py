import pandas as pd
import random

mainarr = []

elective_courses = ['COMP2501', 'COMP2502', 'COMP3231', 'COMP3258', 'COMP3259', 'COMP3270', 'COMP3271', 'COMP3314', 'COMP3316', 'COMP3317', 'COMP3320', 'COMP3322', 'COMP3329', 'COMP3330', 'COMP3340', 'COMP3352', 'COMP3355', 'COMP3356', 'COMP3357', 'COMP3358', 'COMP3360', 'COMP3361', 'COMP3362', 'COMP3407', 'FITE2010', 'FITE3010', 'FITE3012']
grade = [4.3, 4.0, 3.7, 3.3, 3.0, 2.7, 2.3, 2.0, 1.7, 1.3, 1.0]

for i in range(90):
    arr = [int(0)]*(len(elective_courses))
    mainarr.append(arr)

for i in range(90):
    answer = random.sample(range(0,(len(elective_courses))), 6)
    for j in answer:
        mainarr[i][j] = random.choice(grade)


marinarr = [list(i) for i in zip(*mainarr)]
dict = {}
for i in range(len(elective_courses)):
    dict[elective_courses[i]] = marinarr[i]

df = pd.DataFrame(dict)

# df.to_excel(excel_writer = r"C:\Users\Ray\Music\FYP\python\project\temp1.xlsx")

genre = ["AI", "Blockchains", "Fintech", "Game Development", "Web/Mobile Application"]
output = []
for i in range(90):
    answer = random.sample(genre, (random.randint(1,5)))
    input = ','.join(answer)
    output.append(input)

df = pd.DataFrame(output)
df.to_excel(excel_writer = r"C:\Users\Ray\Music\FYP\python\project\temp2.xlsx")

print(output)
print(mainarr)