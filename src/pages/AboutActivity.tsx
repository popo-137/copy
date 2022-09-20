import React from "react";
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonGrid,
  IonImg,
  IonText,
  IonRow,
  IonCol,
  IonThumbnail,
} from "@ionic/react";
import logo from "../res/icon.png";

import "./AboutActivity.css";

const AboutActivity: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle class="a-center">О приложении</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonGrid>
          <IonRow>
            <IonCol>
                <IonImg src={logo} className="about_img"></IonImg>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <IonText class="ion-text-center">
                <h1>Retail Assistant</h1>
                <p>Разработано: ООО "Логика"</p>
                <p>
                  Нашли ошибку или есть пожелания о поводу приложения?
                  <br></br>
                  Свяжитесь с нами
                  <br></br><br></br>
                  <div>Почта: <a href="mailto:logika1c@mail.ru">logika1c@mail.ru</a></div>
                  <br></br>
                  <div>Телефон: <a href="tel:89142722511">+7(914) 272-25-11</a></div>
                </p>
              </IonText>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default AboutActivity;
