export default {
  menu: {
    name: {
      home : 'Accueil',
      buildings: 'Batiments',
      species: 'Espèces',
      containers: 'Conteneurs',
      requests: 'Demandes',
      users: 'Utilisateurs'
    }
  },
  common: {
    edit: 'Modifier',
    save: 'Enregistrer',
    cancel: 'Annuler',
    add: 'Ajouter',
    send: 'Envoyer',
    delete: 'Suprimer'
  },
  form: {
    species: {
      title: 'Espèce',
      nameTitle: 'Nom : ',
      stageTitle: 'Étapes : ',
      drag: {
        name: 'Nom',
        time: 'Durée'
      },
      error: {
        time: 'La durée doit être supérieure à 0'
      }
    },
    building: {
      title: 'Batiment',
      nameTitle: 'Nom : ',
      description: 'Description : ',
      error: {
        name: 'Le nom ne doit pas être vide'
      },
      confirmDelete: 'Voulez-vous vraiment supprimer ce batiment ?'
    },
    compartiment: {
      title: 'Compartiment',
      nameTitle: 'Nom : ',
      height : 'Hauteur : ',
      width : 'Longueur : ',
      error: {
        name: 'Le nom ne doit pas être vide',
        value: 'La valeur doit être supérieure a zero'
      },
      confirmDelete : 'Voulez-vous vraiment supprimer ce compartiment ?'
    }
  }
}
