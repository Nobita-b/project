import cv2


def shape_of_her(image_path):
    import mediapipe as mp

    her_face = mp.solutions.face_mesh


    image=cv2.imread(image_path)
    rgb=cv2.cvtColor(image, cv2.COLOR_BGR2RGB)

    with my_face.FaceMesh(static_image_load=True)as my_face:
        outcome=my_face.process(rgb)

        if not outcome.multi_face_landmarks:
            return{"face_detected":False}
        
        landmarks=outcome.multi_face_landmarks[0].landmark

        face_width=abs(landmarks[234].x-landmarks[454].x)
        face_height=abs(landmarks[10].y-landmarks[152].y)

        if face_width/face_height>1:
            face_shape="Round"
        else:
            face_shape="Oval"

        return{
            "face_detected":True,
            "face_shape":face_shape

        }
