import React, { useEffect, useState } from "react";
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonAlert,
  IonItem,
  IonRow,
  IonList,
  IonText,
  IonCol,
  IonButton,
  IonIcon,
  IonLabel,
  IonSearchbar,
  IonModal,
  IonGrid,
  IonCardSubtitle,
  IonCardTitle,
  IonFooter,
  IonToast,
  IonItemDivider,
  IonImg,
} from "@ionic/react";
import "./Tab2.css";
import update from "immutability-helper";
import {
  Store,
  o_type,
  getGoods,
  t_good,
  getData,
  getImg,
  t_image,
  getCategory,
} from "./Store";
import {
  listOutline,
  ellipsisHorizontalOutline,
  cartOutline,
  closeOutline,
  removeCircleOutline,
  addCircleOutline,
  giftOutline,
  arrowBack,
  arrowBackOutline,
} from "ionicons/icons";

interface t_param {
  Номенклатура: string;
  Склады: Array<string>;
  Группа: string;
}

const g_state: t_good = {
  ГУИД: "",
  Артикул: "",
  Наименование: "",
  Цена: 0,
  Количество: 0,
  Сумма: 0,
  Склад: "",
  Остаток: 0,
  Группа: "",
  Вес: 0,
  Объем: 0,
  Производитель: "",
  ИмпортерКонтрагент: "",
  ДопРеквизиты: [],
};

const gimages_state: t_image = {
  ГУИД: "",
  Картинка: "",
};

interface t_detail {
  Номенклатура: string;
  Количество: number;
  Сумма: number;
}

const Tab2: React.FC = () => {
  // const [loading, setLoading]   = useState(false)
  const [upd, setUpd] = useState(0);
  const [basket, setBasket] = useState(false);
  const [imgOpen, setImgOpen] = useState(false);
  const [b_length, setBLength] = useState(0);
  const [good, setGood] = useState<t_good>(g_state);
  const [gimage, setGimage] = useState<t_image>(gimages_state);
  const [query, setQuery] = useState(false);
  const [doc, setDoc] = useState(false);
  const [docnum, setDocnum] = useState("");
  const [showToast1, setShowToast1] = useState(false);

  Store.subscribe_basket(() => {
    let basket = Store.getState().basket;
    let sum = 0;
    if (basket !== undefined)
      basket.forEach((info) => {
        sum = sum + info.Количество;
      });
    setBLength(sum);
  });

  function delBasket(Артикул: string) {
    let basket = Store.getState().basket;

    if (basket === undefined) basket = [];

    var commentIndex = basket.findIndex(function (b) {
      return b.Артикул === Артикул;
    });
    if (commentIndex >= 0) {
      basket.splice(commentIndex, 1);
      Store.dispatch({ type: "basket", basket: basket });
    }
  }

  function updBasket(Артикул: string, amount: number) {
    let basket = Store.getState().basket;

    if (basket === undefined) basket = [];

    var commentIndex = basket.findIndex(function (b) {
      return b.Артикул === Артикул;
    });
    if (commentIndex >= 0) {
      let b_amount = basket[commentIndex].Количество;
      let sum = b_amount + amount;
      let total = basket[commentIndex].Цена * sum;

      if (sum === 0) delBasket(Артикул);
      else {
        let bask = basket.map((todo) => {
          if (todo.Артикул === good.Артикул) {
            return { ...todo, Количество: sum, Сумма: total };
          } else {
            return todo;
          }
        });
        Store.dispatch({ type: "basket", basket: bask });
      }
    }
  }

  function addBasket(amount: number) {
    let basket = Store.getState().basket;

    if (basket === undefined) basket = [];

    var commentIndex = basket.findIndex(function (b) {
      return b.Артикул === good.Артикул;
    });
    if (commentIndex >= 0) {
      let b_amount = basket[commentIndex].Количество;
      let sum = b_amount + (amount as number);
      let total = basket[commentIndex].Цена * sum;
      var updated = update(basket[commentIndex], {
        Количество: { $set: sum },
        Сумма: { $set: total },
      });

      Store.dispatch({ type: "upd_basket", basket: updated });
    } else {
      Store.dispatch({
        type: "add_basket",
        basket: {
          ГУИД: "",
          Артикул: good.Артикул,
          Наименование: good.Наименование,
          Цена: good.Цена,
          Количество: amount,
          Сумма: good.Цена * amount,
        },
      });
    }
  }

  function Goods(props: { goods: Array<o_type> }): JSX.Element {
    let elem = <></>;
    let goods = props.goods;
    if (goods.length > 0) {
      for (let i = 0; i < goods.length; i++) {
        if (i === 0) {
          if (goods[i].Группа !== "")
            elem = (
              <IonButton
                fill="clear"
                onClick={() => {
                  Store.dispatch({ type: "p1", Номенклатура: "" });
                  Store.dispatch({ type: "gr_del" });
                  Search();
                }}
              >
                <IonIcon
                  icon={ellipsisHorizontalOutline}
                  slot="icon-only"
                ></IonIcon>
              </IonButton>
            );
        }
        if (goods[i].ЭтоГруппа)
          elem = (
            <>
              {elem}
              <IonItem>
                <IonText class="f-1">{goods[i].Номенклатура}</IonText>
                <IonButton
                  slot="end"
                  fill="clear"
                  onClick={() => {
                    Store.dispatch({ type: "gr_add", Группа: goods[i].Код });
                    Search();
                    
                  }}
                >
                  <IonIcon slot="icon-only" icon={listOutline}></IonIcon>
                </IonButton>
              </IonItem>
            </>
          );
        else
          elem = (
            <>
              {elem}
              <IonItem
                onClick={async () => {
                  setGood({
                    ГУИД: goods[i].ГУИД,
                    Артикул: goods[i].Артикул,
                    Наименование: goods[i].Номенклатура,
                    Цена: goods[i].Цена,
                    Количество: 1,
                    Сумма: goods[i].Цена,
                    Склад: goods[i].Склад,
                    Остаток: goods[i].Остаток,
                    Группа: goods[i].Группа,
                    Вес: goods[i].Вес,
                    Объем: goods[i].Объем,
                    Производитель: goods[i].Производитель,
                    ИмпортерКонтрагент: goods[i].ИмпортерКонтрагент,
                    ДопРеквизиты: goods[i].ДопРеквизиты,
                  });

                  await getImg(goods[i].ГУИД);
                  console.log(Store.getState().gimages);

                  setGimage(Store.getState().gimages);

                  if (gimage.ГУИД === good.ГУИД) setImgOpen(true);

                  setQuery(true);
                }}
              >
                <IonLabel position="stacked"> {goods[i].Склад} </IonLabel>
                <IonText class="f-1">{goods[i].Номенклатура}</IonText>
                <IonCol size="3" slot="end" class="f-1">
                  <IonRow> {goods[i].Артикул} </IonRow>
                  <IonRow> {goods[i].Цена} руб </IonRow>
                  <IonRow> {goods[i].Остаток} шт </IonRow>
                </IonCol>
              </IonItem>
            </>
          );
      }
      elem = <IonList>{elem}</IonList>;
    }

    return elem;
  }

  async function Search() {
    let res = await getGoods(Store.getState().param1);
    if (res) setUpd(upd + 1);
    else setUpd(upd + 1);
  }

  function IButton(): JSX.Element {
    let elem = (
      <>
        <IonButton
          slot="end"
          fill="clear"
          onClick={() => {
            setBasket(true);
          }}
        >
          <IonIcon slot="icon-only" icon={cartOutline} />
          <IonText class="red-1"> {b_length} </IonText>
        </IonButton>
      </>
    );

    return elem;
  }

  function BItem(props: { info: t_good }): JSX.Element {
    let info = props.info;
    return (
      <>
        <IonRow class="r-underline">
          <IonCol>
            <IonIcon id="a-margin" icon={giftOutline} />
          </IonCol>
          <IonCol size="8">
            <IonCardSubtitle> {info.Наименование} </IonCardSubtitle>
            <IonCardTitle class="t-right">
              {info.Цена} Х {info.Количество} = {info.Сумма}
            </IonCardTitle>
          </IonCol>
          <IonCol size="2">
            <IonRow>
              <IonCol class="i-col">
                <IonButton
                  class="i-but"
                  fill="clear"
                  onClick={() => {
                    delBasket(info.Артикул);
                  }}
                >
                  <IonIcon slot="icon-only" icon={closeOutline}></IonIcon>
                </IonButton>
              </IonCol>
            </IonRow>
            <IonRow>
              <IonCol class="i-col">
                <IonButton
                  class="i-but"
                  fill="clear"
                  onClick={() => {
                    updBasket(info.Артикул, 1);
                  }}
                >
                  <IonIcon slot="icon-only" icon={addCircleOutline}></IonIcon>
                </IonButton>
              </IonCol>
            </IonRow>
            <IonRow>
              <IonCol class="i-col">
                <IonButton
                  class="i-but"
                  fill="clear"
                  onClick={() => {
                    updBasket(info.Артикул, -1);
                  }}
                >
                  <IonIcon
                    slot="icon-only"
                    icon={removeCircleOutline}
                  ></IonIcon>
                </IonButton>
              </IonCol>
            </IonRow>
          </IonCol>
        </IonRow>
      </>
    );
  }

  function Basket(props: { blen: number }): JSX.Element {
    let b_length = props.blen;

    let basket = Store.getState().basket;

    let items = <IonCardSubtitle> Всего товаров {b_length}</IonCardSubtitle>;

    let sum = 0;
    for (let i = 0; i < basket.length; i++) {
      sum = sum + basket[i].Сумма;
      items = (
        <>
          {items}
          <BItem info={basket[i]} />
        </>
      );
    }

    items = (
      <>
        {items}
        <IonRow>
          <IonCol size="12">Итого на сумму</IonCol>
        </IonRow>
        <IonRow>
          <IonCol size="12" class="t-right r-underline">
            {sum}
          </IonCol>
        </IonRow>
      </>
    );

    return items;
  }

  async function setOrder() {
    let basket = Store.getState().basket;

    let params = {
      Товары: basket,
    };
    let res = await getData("СоздатьЧек", params);
    if (res.Код === 100) {
      setDocnum(res.Номер);
      setDoc(true);
      Store.dispatch({ type: "cl_basket" });
    }
  }

  return (
    <IonPage>
      {/* <IonLoading
        isOpen={loading}
        message={'Please wait...'}
      /> */}

      <IonHeader>
        <IonToolbar>
          <IonTitle class="a-center">Остатки</IonTitle>
          <IButton />
        </IonToolbar>
      </IonHeader>

      <IonSearchbar
        debounce={250}
        onIonChange={(e) => {
          Store.dispatch({ type: "p1", Номенклатура: e.detail.value });
          Search();
        }}
      />
      <IonContent>
        <IonButton
          onClick={() => {
            console.log(Store.getState());
          }}
        >
          sadsad
        </IonButton>
        <IonButton
          onClick={() => {
            getCategory()
            console.log(Store.getState());
          }}
        >
          cat
        </IonButton>
        <Goods goods={Store.getState().goods} />
      </IonContent>

      {/* <IonAlert 
            isOpen={ query }
            onDidDismiss={() => setQuery(false)}
            header={'Корзина'}
            message={good.Наименование}
            //  inputs={[
            //    {
            //      name: 'Количество',
            //      placeholder: 'Количество',
            //      type: 'number',
            //      min: -10,
            //      max: 10,
            //    },             
            //  ]}
            buttons={[
              {
                text: 'Отмена',
                role: 'cancel',
                handler: () => {}
              },           
              {
                text: 'Добавить в корзину',
                handler: (data) => {
                  addBasket(1);
                }
              }
          ]} />  */}

      <IonModal
        isOpen={query}
        swipeToClose={true}
        onDidDismiss={() => setQuery(false)}
      >
        <IonHeader>
          <IonToolbar>
            <IonButton
              fill="clear"
              slot="start"
              onClick={() => {
                setQuery(false);
                Store.dispatch({ type: "del_img" });
              }}
            >
              <IonIcon slot="icon-only" icon={arrowBackOutline}></IonIcon>
            </IonButton>
            <IonButton fill="clear" slot="end" onClick={() => setQuery(false)}>
              <IonIcon slot="icon-only" icon={closeOutline}></IonIcon>
            </IonButton>
            <IonTitle> Информация о товаре </IonTitle>
          </IonToolbar>
        </IonHeader>

        <IonContent>
          <IonGrid class="i-item-modal">
            <IonRow class="ion-justify-content-center">
              {imgOpen ? (
                <IonImg src={gimage.Картинка} />
              ) : (
                <>
                  <IonItemDivider>
                    <IonLabel>Нет изображения</IonLabel>
                  </IonItemDivider>
                  ;
                </>
              )}
            </IonRow>
            <IonRow>
              <IonItemDivider>
                <IonLabel>Наименование</IonLabel>
              </IonItemDivider>
              <IonItem lines="none">{good.Наименование}</IonItem>
            </IonRow>
            <IonRow>
              <IonCol>
                <IonItemDivider>
                  <IonLabel>Группа товара</IonLabel>
                </IonItemDivider>
                <IonItem lines="none">{good.Группа}</IonItem>
              </IonCol>
              <IonCol>
                <IonItemDivider>
                  <IonLabel>Артикул</IonLabel>
                </IonItemDivider>
                <IonItem lines="none">{good.Артикул}</IonItem>
              </IonCol>
            </IonRow>
            <IonRow>
              <IonCol>
                <IonItemDivider>
                  <IonLabel>Склад</IonLabel>
                </IonItemDivider>
                <IonItem lines="none">{good.Склад}</IonItem>
              </IonCol>
              <IonCol>
                <IonItemDivider>
                  <IonLabel>Цена</IonLabel>
                </IonItemDivider>
                <IonItem lines="none">{good.Цена}</IonItem>
              </IonCol>
            </IonRow>
            <IonRow>
              <IonCol>
                <IonItemDivider>
                  <IonLabel>Производитель</IonLabel>
                </IonItemDivider>
                <IonItem lines="none">
                  {good.Производитель === "" ? "~" : good.Производитель}
                </IonItem>
              </IonCol>
              <IonCol>
                <IonItemDivider>
                  <IonLabel>Импортер</IonLabel>
                </IonItemDivider>
                <IonItem lines="none">
                  {good.ИмпортерКонтрагент === ""
                    ? "~"
                    : good.ИмпортерКонтрагент}
                </IonItem>
              </IonCol>
            </IonRow>
            <IonRow>
              <IonCol>
                <IonItemDivider>
                  <IonLabel>Остаток</IonLabel>
                </IonItemDivider>
                <IonItem lines="none">{good.Остаток} шт</IonItem>
              </IonCol>
              <IonCol>
                <IonItemDivider>
                  <IonLabel>Вес</IonLabel>
                </IonItemDivider>
                <IonItem lines="none">
                  {good.Вес === 0 ? "~" : good.Вес} кг
                </IonItem>
              </IonCol>
              <IonCol>
                <IonItemDivider>
                  <IonLabel>Объем</IonLabel>
                </IonItemDivider>
                <IonItem lines="none">
                  {good.Объем === 0 ? "~" : good.Объем} м³{" "}
                </IonItem>
              </IonCol>
            </IonRow>
            <IonCol>
              <IonItemDivider>
                <IonLabel>Дополнительные реквизиты</IonLabel>
              </IonItemDivider>
              {Object.keys(good.ДопРеквизиты).map((e) => {
                return (
                  <IonItem lines="none" key={e}>
                    {e.replace(/_/g, " ")}:{" "}
                    {String(good.ДопРеквизиты[e]) === "true"
                      ? "Да"
                      : good.ДопРеквизиты[e] === "false"
                      ? "Нет"
                      : good.ДопРеквизиты[e]}
                  </IonItem>
                );
              })}
            </IonCol>
            <IonButton
              onClick={() => {
                console.log(Store.getState());
                console.log(imgOpen);
              }}
            >
              ryjgrf
            </IonButton>
          </IonGrid>
        </IonContent>

        <IonFooter>
          <IonToolbar>
            <IonButton
              slot="start"
              onClick={() => {
                setQuery(false);
              }}
            >
              {" "}
              Отменить
            </IonButton>
            <IonButton
              slot="end"
              onClick={() => {
                setShowToast1(true);
                addBasket(1);
              }}
            >
              {" "}
              Добавить в корзину
            </IonButton>
          </IonToolbar>
        </IonFooter>
      </IonModal>

      <IonToast
        isOpen={showToast1}
        onDidDismiss={() => setShowToast1(false)}
        message="Товар добавлен в корзину"
        position="middle"
        duration={200}
      />

      <IonAlert
        isOpen={doc}
        onDidDismiss={() => setDoc(false)}
        header={docnum}
        message={"Документ создан"}
        buttons={[
          {
            text: "Ok",
            handler: (data) => {},
          },
        ]}
      />

      <IonModal
        isOpen={basket}
        className="my-custom-class"
        swipeToClose={true}
        onDidDismiss={() => setBasket(false)}
      >
        <IonHeader>
          <IonToolbar>
            <IonButton
              fill="clear"
              slot="start"
              onClick={() => setBasket(false)}
            >
              <IonIcon slot="icon-only" icon={arrowBackOutline}></IonIcon>
            </IonButton>
            <IonButton fill="clear" slot="end" onClick={() => setBasket(false)}>
              <IonIcon slot="icon-only" icon={closeOutline}></IonIcon>
            </IonButton>
            <IonTitle> Корзина </IonTitle>
          </IonToolbar>
        </IonHeader>

        <IonContent>
          <IonGrid class="i-content">
            <Basket blen={b_length} />
          </IonGrid>
        </IonContent>

        <IonFooter>
          <IonToolbar>
            <IonButton
              slot="start"
              onClick={() => {
                Store.dispatch({ type: "cl_basket" });
                setBasket(false);
              }}
            >
              {" "}
              Отменить
            </IonButton>
            <IonButton
              slot="end"
              onClick={() => {
                setBasket(false);
                setOrder();
              }}
            >
              {" "}
              Чек
            </IonButton>
          </IonToolbar>
        </IonFooter>
      </IonModal>
    </IonPage>
  );
};

export default Tab2;
