from json import dumps
from random import randint

def genId(i):
    return str(i%10) + "-" + str(i//10)

office_size = 48

data = []
index_id = {}

for i in range(office_size):
    data.append({'id': genId(i), 'friends': [], 'enemies': []});
    index_id[data[i]['id']] = i

for i in range(office_size):
    fn = randint(0, 5)
    free_workers = data[:i] + data[i+1:]
    
    for j in range(fn):
        fr_i = randint(0, len(free_workers)-1)
        data[i]['friends'].append(free_workers.pop(fr_i)['id'])
    
    en = randint(0, 2)
    for j in range(en):
        en_i = randint(0, len(free_workers)-1)
        data[i]['enemies'].append(free_workers.pop(en_i)['id'])
    

f = open("test.json", "w")
f.write(dumps(data))
f.close();
