import React, { useState } from "react";
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonSlides,
  IonSlide,
  IonGrid,
  IonIcon,
  IonButton,
  IonAlert,
  IonLoading,
  IonModal,
  IonDatetime,
  IonRadio,
  IonRadioGroup,
  IonItem,
  IonLabel,
  IonDatetimeButton,
  IonRow,
  IonCol,
} from "@ionic/react";

import { Store, getData, StoreToString } from "./Store";
import LineChart from "./chart";
import moment from "moment";
import "./Tab1.css";
import {
  syncOutline,
  layersOutline,
  optionsOutline,
  closeOutline,
  checkmarkOutline,
  peopleOutline,
} from "ionicons/icons";
import BarChart from "./UsersChart";

//const Tab1: React.FC = () => {
class Tab1 extends React.Component {
  state = {
    logout: false,
    stores: false,
    load: false,
    query: false,
    selectedPeriod: false,
    startdate: moment().toISOString(),
    enddate: "",
    upd1: 0,
    upd2: 0,
    upd3: 0,
    upd4: 0,

    options: false,
    serv: "",
    port: "",
  };

  async setStore(data) {
    Store.dispatch({ type: "set_sto", data: false });
    data.forEach((stor) => {
      Store.dispatch({ type: "upd_sto", value: stor, checked: true });
    });

    let starr = StoreToString();

    Store.dispatch({ type: "p1", Склады: starr });

    Store.dispatch({ type: "list_sto" });
  }

  render() {
    const { logout } = this.state;

    Store.subscribe_store(() => {
      this.setState({
        upd1: this.state.upd1 + 1,
        upd2: this.state.upd2 + 1,
        upd3: this.state.upd3 + 1,
        upd4: this.state.upd4 + 1,
      });
    });

    return (
      <IonPage>
        <IonLoading isOpen={this.state.load} message={"Please wait..."} />
        <IonHeader>
          <IonToolbar>
            {/* <IonButton
              slot="start"
              fill="clear"
              onClick={() => {
                // getData();
              }}
            >
              <IonIcon slot="icon-only" icon={syncOutline}></IonIcon>
            </IonButton> */}

            <IonTitle class="a-center">Графики продаж</IonTitle>
            {/* <LogButtons /> */}
            <IonButton
              slot="end"
              fill="clear"
              onClick={() => {
                let serv = localStorage.getItem("StokHolm_SERV");
                if (serv === null) serv = "188.244.191.2";
                let port = localStorage.getItem("StokHolm_PORT");
                if (port === null) port = "29080";
                this.setState({ options: true, serv: serv, port: port });
              }}
            >
              <IonIcon icon={optionsOutline} slot="icon-only"></IonIcon>
            </IonButton>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <IonRow>
            <IonCol>
              <IonButton
                fill="clear"
                onClick={() => {
                  this.setState({ stores: true });
                }}
              >
                <IonIcon icon={layersOutline}></IonIcon>
                Склады
              </IonButton>
            </IonCol>
            <IonCol className="statbtn">
              <IonButton
                fill="clear"
                onClick={() => {
                  this.setState({ query: true });
                }}
              >
                <IonIcon icon={peopleOutline}></IonIcon>
                Статистика
              </IonButton>
            </IonCol>
          </IonRow>

          <IonSlides>
            <IonSlide>
              <IonGrid>
                <LineChart period="День" upd={this.state.upd1} />
              </IonGrid>
            </IonSlide>

            <IonSlide>
              <IonGrid>
                <LineChart period="Неделя" upd={this.state.upd2} />
              </IonGrid>
            </IonSlide>

            <IonSlide>
              <IonGrid>
                <LineChart period="Месяц" upd={this.state.upd3} />
              </IonGrid>
            </IonSlide>

            <IonSlide>
              <IonGrid>
                <LineChart period="Год" upd={this.state.upd4} />
              </IonGrid>
            </IonSlide>
          </IonSlides>
        </IonContent>

        <IonModal isOpen={this.state.query}>
          <IonHeader>
            <IonToolbar>
              <IonTitle>Статистика по продавцам</IonTitle>
              <IonButton
                fill="clear"
                slot="start"
                onClick={() => {
                  this.setState({ query: false });
                }}
              >
                <IonIcon slot="icon-only" icon={closeOutline}></IonIcon>
              </IonButton>
            </IonToolbar>
          </IonHeader>
          <IonContent>
            <IonRadioGroup
              value={this.state.selectedPeriod}
              onIonChange={(e) =>
                this.setState({ selectedPeriod: e.detail.value })
              }
            >
              <IonItem>
                <IonLabel>День</IonLabel>
                <IonRadio value={false} />
              </IonItem>
              <IonItem>
                <IonLabel>Период</IonLabel>
                <IonRadio value={true} />
              </IonItem>
            </IonRadioGroup>
            <IonRow className="daterow">
              <IonCol>
              <input id="startdate" type="date" onChange={(e) => this.setState({ startdate: e.target.value })}/>
              </IonCol>
              <IonCol className="datecol">
              <input hidden={!this.state.selectedPeriod} id="enddate" type="date" onChange={(e) => this.setState({ enddate: e.target.value })} min={this.state.startdate}/>
              </IonCol>
            </IonRow>
            <BarChart
              startdate={this.state.startdate}
              enddate={this.state.enddate}
              period={this.state.selectedPeriod}
            ></BarChart>
          </IonContent>
        </IonModal>

        {/* Логоут */}
        <IonAlert
          isOpen={logout}
          onDidDismiss={() => this.setState({ logout: false })}
          header={"Выход"}
          message={"Выйти из аккаунта"}
          buttons={[
            {
              text: "Cancel",
              role: "cancel",
              handler: () => {},
            },
            {
              text: "Ok",
              handler: (data) => {
                this.setState({ auth: false });
              },
            },
          ]}
        />

        {/* Склады */}
        <IonAlert
          isOpen={this.state.stores}
          onDidDismiss={() => this.setState({ stores: false })}
          header={"Склады"}
          message={""}
          inputs={Store.getState().stores}
          buttons={[
            {
              text: "Cancel",
              role: "cancel",
              handler: () => {},
            },
            {
              text: "Ok",
              handler: (data) => {
                this.setStore(data);
              },
            },
          ]}
        />

        {/* Оптионс */}
        <IonAlert
          isOpen={this.state.options}
          onDidDismiss={() => this.setState({ options: false })}
          header={"Настройки"}
          message={""}
          inputs={[
            {
              name: "Сервер",
              type: "text",
              placeholder: "Сервер",
              value: this.state.serv,
            },
            {
              name: "Порт",
              type: "text",
              placeholder: "Порт",
              value: this.state.port,
            },
          ]}
          buttons={[
            {
              text: "Cancel",
              role: "cancel",
              handler: () => {},
            },
            {
              text: "Ok",
              handler: (data) => {
                localStorage.setItem("StokHolm_SERV", data.Сервер);
                localStorage.setItem("StokHolm_PORT", data.Порт);
              },
            },
          ]}
        />
      </IonPage>
    );
  }
}

export default Tab1;
