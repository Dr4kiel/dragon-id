import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Web3 from "web3";

export default function DragonIDForm() {
  const [form, setForm] = useState({ name: "", surname: "", age: "", color: "red" });
  const [submitted, setSubmitted] = useState(false);
  const [account, setAccount] = useState(null);
  const [transactionHash, setTransactionHash] = useState(null);
  const [dragonId, setDragonId] = useState(null);
  const [dragonList, setDragonList] = useState([]);

  const dragonImages = {
    red: "/images/red-dragon.png",  // Remplace par l'image locale
    blue: "/images/blue-dragon.png", // Remplace par l'image locale
    green: "/images/green-dragon.png", // Remplace par l'image locale
    black: "/images/black-dragon.png", // Remplace par l'image locale
  };

  const contractAddress = "0xb2443146EC9F5a1a5Fd5c1C9C0fe5f5cC459A31A";
  const abi = [
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "dragonId",
          "type": "uint256"
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
      "name": "dragonToOwner",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
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
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getDragons",
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
      "name": "nextId",
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
    async function fetchDragons() {
      if (window.ethereum) {
        const web3 = new Web3(window.ethereum);
        const contract = new web3.eth.Contract(abi, contractAddress);
        try {
          const dragons = await contract.methods.getDragons().call();
          setDragonList(dragons);
        } catch (error) {
          console.error("Erreur lors du chargement des dragons", error);
        }
      }
    }
    fetchDragons();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (window.ethereum) {
      const web3 = new Web3(window.ethereum);
      try {
        await window.ethereum.request({ method: "eth_requestAccounts" });
        const accounts = await web3.eth.getAccounts();
        setAccount(accounts[0]);

        const contract = new web3.eth.Contract(abi, contractAddress);
        const transaction = await contract.methods.createDragon(form.name, form.surname, form.age, form.color).send({ from: accounts[0] });
        setTransactionHash(transaction.transactionHash);

        const event = transaction.events.DragonCreated;
        if (event) {
          setDragonId(event.returnValues.dragonId);
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
      {!submitted ? (
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
            src={dragonImages[form.color]}
            alt={`${form.color} Dragon`}
            className="w-full max-w-xs h-auto object-contain mb-4 rounded-md"
          />

          {/* Contenu de la carte */}
          <CardContent>
            <p><strong>ID :</strong> {dragonId}</p>
            <p><strong>Nom :</strong> {form.name}</p>
            <p><strong>Prénom :</strong> {form.surname}</p>
            <p><strong>Âge :</strong> {form.age} ans</p>
            <p><strong>Couleur :</strong> {form.color}</p>
            <p><strong>Compte Ethereum :</strong> {account || "Non connecté"}</p>
          </CardContent>

          {/* Bouton Modifier */}
          <Button onClick={() => setSubmitted(false)} className="mt-4">
            Modifier
          </Button>
        </Card>

      )}

      <h2 className="text-xl font-bold mt-8">Liste des Dragons Créés</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
