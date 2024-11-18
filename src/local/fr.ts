export default {
  menu: {
    name: {
      home: 'Accueil',
      buildings: 'Bâtiments',
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
    delete: 'Supprimer'
  },
  form: {
    species: {
      title: 'Espèce',
      nameTitle: 'Nom : ',
      stageTitle: 'Étapes : ',
      confirmDelete: 'Voulez-vous vraiment supprimer cette espèce ?',
      drag: {
        name: 'Nom',
        time: 'Durée'
      },
      error: {
        name: 'Le nom ne doit pas être vide',
        time: 'La durée doit être supérieure à 0'
      }
    },
    building: {
      title: 'Bâtiment',
      nameTitle: 'Nom : ',
      description: 'Description : ',
      error: {
        name: 'Le nom ne doit pas être vide'
      },
      confirmDelete: 'Voulez-vous vraiment supprimer ce bâtiment ?'
    },
    compartiment: {
      title: 'Compartiment',
      nameTitle: 'Nom : ',
      height : 'Hauteur : ',
      width : 'Longueur : ',
      occupation : 'Occupation : ',
      error: {
        name: 'Le nom ne doit pas être vide',
        value: 'La valeur doit être supérieure a zero'
      },
      confirmDelete : 'Voulez-vous vraiment supprimer ce compartiment ?'
    },
    container: {
      title: 'Conteneur',
      nameTitle: 'Nom : ',
      description: 'Description : ',
      shape: 'Forme : ',
      areaTitle: 'Surface (en cm²) : ',
      dimensions: 'Dimensions : ',
      area: 'Aire',
      error: {
        name: 'Le nom ne doit pas être vide',
        shape: 'La forme ne doit pas être vide',
        areaOrDimensions: 'Vous devez renseigner soit la surface, soit les dimensions'
      },
      confirmDelete: 'Voulez-vous vraiment supprimer ce conteneur ?'
    }
  }
};
