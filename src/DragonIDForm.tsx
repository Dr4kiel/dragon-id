import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Web3 from "web3";

export default function DragonIDForm() {

  interface Dragon {
    name: string;
    surname: string;
    age: number;
    color: string;
  }

  const [form, setForm] = useState({ name: "", surname: "", age: "", color: "red" });
  const [submitted, setSubmitted] = useState(false);
  const [account, setAccount] = useState(null);
  const [dragon, setDragon] = useState<Dragon | null>(null);
  const [dragonList, setDragonList] = useState([]);

  const dragonImages = {
    red: "/images/red-dragon.png",  // Remplace par l'image locale
    blue: "/images/blue-dragon.png", // Remplace par l'image locale
    green: "/images/green-dragon.png", // Remplace par l'image locale
    black: "/images/black-dragon.png", // Remplace par l'image locale
  };

  const contractAddress = "0x32Cf1f3a98aeAF57b88b3740875D19912A522c1A";
  const abi = [
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "dragonId",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "owner",
          "type": "address"
        }
      ],
      "name": "DragonCreated",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "_name",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "_surname",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "_age",
          "type": "uint256"
        },
        {
          "internalType": "string",
          "name": "_color",
          "type": "string"
        }
      ],
      "name": "createDragon",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "dragons",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "id",
          "type": "uint256"
        },
        {
          "internalType": "string",
          "name": "name",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "surname",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "age",
          "type": "uint256"
        },
        {
          "internalType": "string",
          "name": "color",
          "type": "string"
        },
        {
          "internalType": "address",
          "name": "owner",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getAllDragons",
      "outputs": [
        {
          "components": [
            {
              "internalType": "uint256",
              "name": "id",
              "type": "uint256"
            },
            {
              "internalType": "string",
              "name": "name",
              "type": "string"
            },
            {
              "internalType": "string",
              "name": "surname",
              "type": "string"
            },
            {
              "internalType": "uint256",
              "name": "age",
              "type": "uint256"
            },
            {
              "internalType": "string",
              "name": "color",
              "type": "string"
            },
            {
              "internalType": "address",
              "name": "owner",
              "type": "address"
            }
          ],
          "internalType": "struct DragonIdentity.Dragon[]",
          "name": "",
          "type": "tuple[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getMyDragon",
      "outputs": [
        {
          "components": [
            {
              "internalType": "uint256",
              "name": "id",
              "type": "uint256"
            },
            {
              "internalType": "string",
              "name": "name",
              "type": "string"
            },
            {
              "internalType": "string",
              "name": "surname",
              "type": "string"
            },
            {
              "internalType": "uint256",
              "name": "age",
              "type": "uint256"
            },
            {
              "internalType": "string",
              "name": "color",
              "type": "string"
            },
            {
              "internalType": "address",
              "name": "owner",
              "type": "address"
            }
          ],
          "internalType": "struct DragonIdentity.Dragon",
          "name": "",
          "type": "tuple"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "nextDragonId",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "name": "ownerToDragon",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ];

  useEffect(() => {

    async function fetchDragon() {
      if (window.ethereum) {
        const web3 = new Web3(window.ethereum);
        const contract = new web3.eth.Contract(abi, contractAddress);
        try {
          const myDragon = await contract.methods.getMyDragon().call({ from: account });
          setDragon(myDragon);
        } catch (error) {
          console.error("No dragon found", error);
          setDragon(null)
        }
      }
    }

    if (account) {
      // Cette fonction sera exécutée chaque fois que `account` est mis à jour
      console.log("save : " + account);
      fetchDragon();
    }
  }, [account]); // Dépendance sur `account` pour réagir à sa mise à jour

  useEffect(() => {

    if (window.ethereum) {
      const web3 = new Web3(window.ethereum);
      const contract = new web3.eth.Contract(abi, contractAddress);

      // Écouter l'événement DragonCreated
      contract.events.DragonCreated({
        fromBlock: 'latest',
        filter: { owner: account } // Filtrer les dragons créés par l'adresse de l'utilisateur
      })
        .on('data', (event) => {
          console.log('Événement DragonCreated reçu: ', event);
        })
    } else {
      alert('Veuillez installer MetaMask pour continuer.');
    }

    async function fetchDragons() {
      if (window.ethereum) {
        const web3 = new Web3(window.ethereum);
        const contract = new web3.eth.Contract(abi, contractAddress);
        try {
          const dragons = await contract.methods.getAllDragons().call();
          setDragonList(dragons);
        } catch (error) {
          console.error("Erreur lors du chargement des dragons", error);
        }
      }
    }
    fetchDragons();

    // Demander l'accès aux compte de l'utilisateur
    window.ethereum.request({ method: 'eth_requestAccounts' })
      .then(accounts => {
        setAccount(accounts[0]); // Stocker le premier compte sélectionné
        console.log("save : " + account)
      })
      .catch((error) => {
        console.error('Erreur lors de la récupération du compte :', error);
      });

    // Écouter les changements de compte dans MetaMask
    window.ethereum.on('accountsChanged', (accounts) => {
      setAccount(accounts[0]); // Mettre à jour le compte lorsqu'il change
    });

  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (window.ethereum) {
      const web3 = new Web3(window.ethereum);
      try {

        const contract = new web3.eth.Contract(abi, contractAddress);
        const transaction = await contract.methods.createDragon(form.name, form.surname, form.age, form.color).send({ from: account });

        const event = transaction.events.DragonCreated;
        if (event) {
          setDragonList([...dragonList, { id: event.returnValues.dragonId, ...form }]);
        }

        setSubmitted(true);
      } catch (error) {
        console.error("Transaction failed", error);
      }
    } else {
      console.error("Ethereum wallet is not available");
    }
  };

  return (
    <div className="flex flex-col items-center gap-6 p-6">
      <h1 className="text-2xl font-bold">Création de la Carte d'Identité du Dragon</h1>
      {!submitted && !dragon ? (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 bg-gray-100 p-6 rounded-lg shadow-lg">
          <input type="text" name="name" placeholder="Nom" className="p-2 border rounded" onChange={handleChange} required />
          <input type="text" name="surname" placeholder="Prénom" className="p-2 border rounded" onChange={handleChange} required />
          <input type="number" name="age" placeholder="Âge" className="p-2 border rounded" onChange={handleChange} required />
          <select name="color" className="p-2 border rounded" onChange={handleChange}>
            <option value="red">Rouge</option>
            <option value="blue">Bleu</option>
            <option value="green">Vert</option>
            <option value="black">Noir</option>
          </select>
          <Button type="submit">Générer la Carte</Button>
        </form>
      ) : (
        <Card>
          <h2 className="text-xl font-semibold text-center mb-4 text-black">Carte d'Identité du Dragon</h2>

          {/* Image du dragon */}
          <img
            src={dragonImages[dragon.color]}
            alt={`${form.color} Dragon`}
            className="w-full max-w-xs h-auto object-contain mb-4 rounded-md"
          />

          {/* Contenu de la carte */}
          <CardContent>
            <p><strong>ID :</strong> {dragon.id}</p>
            <p><strong>Nom :</strong> {dragon.name}</p>
            <p><strong>Prénom :</strong> {dragon.surname}</p>
            <p><strong>Âge :</strong> {dragon.age} ans</p>
            <p><strong>Couleur :</strong> {dragon.color}</p>
            <p><strong>Compte Ethereum :</strong> {account || "Non connecté"}</p>
          </CardContent>

          {/* Bouton Modifier */}
          {/* <Button onClick={() => setSubmitted(false)} className="mt-4">
            Modifier
          </Button> */}
        </Card>

      )}

      <h2 className="text-xl font-bold mt-8">Cartes de Dragons</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {dragonList.map((dragon) => (
          <Card key={dragon.id} className="p-4">
            <CardContent>
              {/* Affichage de l'image du dragon */}
              <img
                src={dragonImages[dragon.color.toLowerCase()]}
                alt={`${dragon.color} Dragon`}
                className="w-full h-64 object-cover mb-4 rounded-md"
              />
              <p><strong>ID :</strong> {dragon.id}</p>
              <p><strong>Nom :</strong> {dragon.name}</p>
              <p><strong>Prénom :</strong> {dragon.surname}</p>
              <p><strong>Âge :</strong> {dragon.age} ans</p>
              <p><strong>Couleur :</strong> {dragon.color}</p>
            </CardContent>
          </Card>
        ))}
      </div>

    </div>
  );
}
