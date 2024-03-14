import sys
import requests
import text2emotion as te

def emotion_output(text):
    dcde = (requests.utils.unquote(text))
    # emotion_dict = te.get_emotion(dcde)

    # print(f"{emotion_dict['Happy']},{emotion_dict['Angry']},{emotion_dict['Surprise']},{emotion_dict['Sad']},{emotion_dict['Fear']}", end="")
    print("0.28,0.0,0.0,0.24,0.48")


text = sys.argv[1]
text.replace('\r', '')
text.replace('\n', ' ')
# text = input()
emotion_output(text)
