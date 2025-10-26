import { Heart, MapPinCheckInside, Rabbit, Scissors } from "lucide-react";


import bagImg from "../assets/bag.jpg";
import pantsImg from "../assets/pants.jpg";
import skirtImg from "../assets/skirt.jpg";


export const navItems = [
  { label: "Pocetna", href: "/" },
  { label: "Proizvodi", href: "/products" },
  { label: "Korpa", href: "/cart" },
  { label: "Dashboard", href: "/userDashboard" },
  { label: "Admin", href: "/adminDashboard" },
  { label: "Transaction", href: "/adminTransactionsPage" },
];

export const categoryImages: Record<string, string> = {
  bag: bagImg,
  pants: pantsImg,
  skirt: skirtImg,
};

export const features = [
  {
    icon: <Scissors />,
    text: "Ručno pravljeno",
    description:
      "Svaki proizvod je pažljivo sašiven ručno, sa posebnom pažnjom na detalje",
  },
  {
    icon: <Heart />,
    text: "Sa ljubavlju",
    description:
      "U svaki komad ulažemo strast i posvećenost tradicionalnom zanatu.",
  },
  {
    icon: <MapPinCheckInside />,
    text: "Lokalno",
    description:
      "Ponosni smo što podržavamo lokalno zanatlije i tradicionalno umeće",
  },
  {
    icon: <Rabbit />,
    text: "Brza isporuka",
    description: "Uprkos ručnoj proizvodnji, garantujemo isporuku za 7-10 dana",
  },
];

export const checklistItems = [
  {
    title: "Odaberite proizvod",
    description: "Izaberite šta želite da poručite iz naše ponude",
  },
  {
    title: "Unesite mere",
    description: "Definisite tačne dimenzije koje vam odgovaraju",
  },
  {
    title: "Dobijte proizvod",
    description: "Za 7-10 dana dobićete proizvod sašiven po vašoj meri",
  },
];

export const resourcesLinks = [
  { href: "#", text: "O nama" },
  { href: "#", text: "Vodič kroz veličine" },
  { href: "#", text: "Materijali i nega tkanine" },
  { href: "#", text: "Kontakt i podrška" },
];

export const platformLinks = [
  { href: "#", text: "Kreiraj svoj proizvod" },
  { href: "#", text: "Kolekcije" }
];

export const communityLinks = [
  { href: "#", text: "Utisci kupaca" },
  { href: "#", text: "Saradnje i partnerstva" },
  { href: "#", text: "Pridruži se zajednici" }
];