import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Web3 from "web3";
import React from "react";

export default function DragonIDForm() {
  const [form, setForm] = useState({ name: "", surname: "", age: "", color: "red", id: ""});
  const [submitted, setSubmitted] = useState(false);
  const [account, setAccount] = useState(null);
  const [transactionHash, setTransactionHash] = useState(null);

  const dragonImages = {
    red: "https://dummyimage.com/150x150/FF0000/FFFFFF&text=Red+Dragon",
    blue: "https://dummyimage.com/150x150/0000FF/FFFFFF&text=Blue+Dragon",
    green: "https://dummyimage.com/150x150/008000/FFFFFF&text=Green+Dragon",
    black: "https://dummyimage.com/150x150/000000/FFFFFF&text=Black+Dragon",
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (window.ethereum) {
      const web3 = new Web3(window.ethereum);

      try {
        // Demander l'accès aux comptes Ethereum
        await window.ethereum.request({ method: "eth_requestAccounts" });
        const accounts = await web3.eth.getAccounts();
        setAccount(accounts[0]);

        // L'adresse de ton contrat déployé sur Ganache
        const contractAddress = "0xD3aA556287Afe63102e5797BFDDd2A1E8DbB3eA5"; // Remplace par l'adresse de ton contrat

        // L'ABI de ton contrat
        const contractABI = [
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
            "anonymous": false,
            "inputs": [
              {
                "indexed": false,
                "internalType": "uint256",
                "name": "id",
                "type": "uint256"
              },
              {
                "indexed": false,
                "internalType": "string",
                "name": "name",
                "type": "string"
              },
              {
                "indexed": false,
                "internalType": "string",
                "name": "surname",
                "type": "string"
              },
              {
                "indexed": false,
                "internalType": "uint256",
                "name": "age",
                "type": "uint256"
              },
              {
                "indexed": false,
                "internalType": "string",
                "name": "color",
                "type": "string"
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
            "inputs": [],
            "name": "dragonCount",
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
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
              }
            ],
            "name": "dragons",
            "outputs": [
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
            "inputs": [
              {
                "internalType": "uint256",
                "name": "_id",
                "type": "uint256"
              }
            ],
            "name": "getDragon",
            "outputs": [
              {
                "internalType": "string",
                "name": "",
                "type": "string"
              },
              {
                "internalType": "string",
                "name": "",
                "type": "string"
              },
              {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
              },
              {
                "internalType": "string",
                "name": "",
                "type": "string"
              },
              {
                "internalType": "address",
                "name": "",
                "type": "address"
              }
            ],
            "stateMutability": "view",
            "type": "function"
          }
        ]; // Assure-toi que l'ABI est complète

        // Initialisation du contrat avec Web3
        const contract = new web3.eth.Contract(contractABI, contractAddress);

        // Appel de la fonction createDragon depuis le contrat
        const name = form.name;
        const surname = form.surname;
        const age = parseInt(form.age); // On suppose que l'âge est un nombre
        const color = form.color;

        // Envoi de la transaction
        const receipt = await contract.methods
          .createDragon(name, surname, age, color)
          .send({ from: accounts[0] });

        console.log("Dragon créé avec succès", receipt);

        // Récupérer le hash de la transaction
        setTransactionHash(receipt.transactionHash);

        // Marquer le formulaire comme soumis
        setSubmitted(true);
      } catch (error) {
        console.error("Erreur lors de la transaction", error);
      }
    } else {
      console.error("Le portefeuille Ethereum n'est pas disponible");
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
        <Card className="p-6 bg-gray-100 rounded-lg shadow-lg flex flex-col items-center">
          <h2 className="text-xl font-semibold">Carte d'Identité du Dragon</h2>
          <img src={dragonImages[form.color]} alt="Dragon" className="w-32 h-32 my-4 rounded" />
          <CardContent>
          <p><strong>ID :</strong> {form.id}</p>
            <p><strong>Nom :</strong> {form.name}</p>
            <p><strong>Prénom :</strong> {form.surname}</p>
            <p><strong>Âge :</strong> {form.age} ans</p>
            <p><strong>Couleur :</strong> {form.color}</p>
            <p><strong>Compte Ethereum :</strong> {account || "Non connecté"}</p>
            {transactionHash && <p><strong>Transaction :</strong> {transactionHash}</p>}
          </CardContent>
          <Button onClick={() => setSubmitted(false)}>Modifier</Button>
        </Card>
      )}
    </div>
  );
}
