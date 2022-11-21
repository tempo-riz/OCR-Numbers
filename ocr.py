# OCR

from keras.utils import np_utils
from keras.layers.core import Dense, Dropout, Activation, Flatten
from keras.models import Sequential, load_model

import os
os.environ['TF_CPP_MIN_LOG_LEVEL']='3'
os.environ['CUDA_VISIBLE_DEVICES'] = ''

# API
from fastapi import FastAPI, status
from pydantic import BaseModel
import numpy as np
import numpy.typing as npt
from fastapi.middleware.cors import CORSMiddleware
import json


#utils
import random
from typing import Tuple


app = FastAPI()

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class Msg(BaseModel):
    number: int
    data: list

def update_and_get_dataset(msg: Msg, filename:str)-> Tuple:
    
    dataset = {
        "numbers":[],
        "datas":[]
    }

    with open(filename) as fp:
        dataset = json.load(fp)
    
    dataset['numbers'].append(msg.number)
    dataset['datas'].append(msg.data)

    print(len(dataset['numbers']),"images ")


    with open(filename, 'w') as json_file:
        json.dump(dataset, json_file,indent=2)

    return np.array(dataset['numbers']),np.array(dataset['datas'])

def get_dataset(filename:str)-> Tuple:
    with open(filename) as fp:
        dataset = json.load(fp)
    return np.array(dataset['numbers']),np.array(dataset['datas'])
    

input_size = 400
output_size = 10

print("creating model")
# sequential model with 3 layers of 512 nodes
model = Sequential()

model.add(Dense(512, input_shape=(input_size,)))
model.add(Activation('relu'))
model.add(Dropout(0.2))

model.add(Dense(512))
model.add(Activation('relu'))
model.add(Dropout(0.2))

model.add(Dense(512))
model.add(Activation('relu'))
model.add(Dropout(0.2))

model.add(Dense(output_size))
model.add(Activation('softmax'))
# compiling the sequential model
model.compile(loss='categorical_crossentropy', metrics=['accuracy'], optimizer='adam')


# ROUTES

@app.post("/train")
def train(msg: Msg):

    numbers,datas=update_and_get_dataset(msg,"data/newset.json")

    # one hot encoding, ex 5 -> [0,0,0,0,0,1,0,0,0,0]
    numbers = np_utils.to_categorical(numbers, output_size)

    # training the model
    model.fit(datas, numbers, batch_size=128, epochs=17, verbose=2)

    model.save("model/keras.h5")
    print("model trained")

    return status.HTTP_200_OK


@app.post("/recognize")
def recognize(msg: Msg):

    model = load_model("model/keras.h5")
    image=np.array([msg.data])

    prediction=model.predict(image)[0]
    print(prediction)
    number=np.argmax(prediction)
    print(number)

    return {"result":int(number)}


@app.get("/precision")
def precision():


    numbers,datas=get_dataset('data/test.json')

    model = load_model("model/keras.h5")

    # create stats
    total=[0 for i in range(10)]
    for n in numbers:
        total[n]+=1

    found=[0 for i in range(10)]

    predictions=model.predict(datas)

    for i in range(len(predictions)):
        found_number=np.argmax(predictions[i])
        real_number=numbers[i]
        if(found_number==real_number):
            found[real_number]+=1
    
    ret=[]
    for i in range(10):
        pourcentage=100*found[i]/total[i]
        ret.append(pourcentage)
        print(i,":",pourcentage,"%")
    print(total)
    print(found)
    total_pourcentage=100*np.sum(found)/np.sum(total)
    print("total:",total_pourcentage)

    return {"precision": ret,"total":total_pourcentage}


@app.post("/test")
def addToTest(msg: Msg):

    update_and_get_dataset(msg,"data/test.json")

    print("saved to test")

    return status.HTTP_200_OK


@app.post("/addtrain")
def addToTrain(msg: Msg):

    update_and_get_dataset(msg,"data/newset.json")

    print("saved to training set")

    return status.HTTP_200_OK


@app.get("/random")
def random1():
    numbers,datas=get_dataset('data/dataset.json')
    i=random.randint(0,len(numbers)-1)

    return {"number":int(numbers[i]),"data":datas[i].tolist()}

currentIndex=-1
_,data_saved=get_dataset('data/newset.json')

@app.get("/next")
def next():
    global currentIndex
    currentIndex+=1
    if(currentIndex<len(data_saved)):
        return {"index":currentIndex,"data":data_saved[currentIndex].tolist()}
    else:   
        return {"index":-1,"data":""}

