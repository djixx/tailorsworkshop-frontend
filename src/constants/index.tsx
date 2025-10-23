import { Heart, MapPinCheckInside, Rabbit, Scissors } from "lucide-react";


export const navItems = [ 
  { label: "Pocetna", href: "/" },
  { label: "Proizvodi", href: "/products" },
  { label: "Korpa", href: "/cart" },
  { label: "Dashboard", href: "/userDashboard" },
  { label: "Admin", href: "/adminDashboard" },
];


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
    description:
      "Uprkos ručnoj proizvodnji, garantujemo isporuku za 7-10 dana",
  },
];

export const checklistItems = [
  {
    title: "Odaberite proizvod",
    description:
      "Izaberite šta želite da poručite iz naše ponude",
  },
  {
    title: "Unesite mere",
    description:
      "Definisite tačne dimenzije koje vam odgovaraju",
  },
  {
    title: "Dobijte proizvod",
    description:
      "Za 7-10 dana dobićete proizvod sašiven po vašoj meri",
  }
];

export const resourcesLinks = [
  { href: "#", text: "Getting Started" },
  { href: "#", text: "Documentation" },
  { href: "#", text: "Tutorials" },
  { href: "#", text: "API Reference" },
  { href: "#", text: "Community Forums" },
];

export const platformLinks = [
  { href: "#", text: "Features" },
  { href: "#", text: "Supported Devices" },
  { href: "#", text: "System Requirements" },
  { href: "#", text: "Downloads" },
  { href: "#", text: "Release Notes" },
];

export const communityLinks = [
  { href: "#", text: "Events" },
  { href: "#", text: "Meetups" },
  { href: "#", text: "Conferences" },
  { href: "#", text: "Hackathons" },
  { href: "#", text: "Jobs" },
];
