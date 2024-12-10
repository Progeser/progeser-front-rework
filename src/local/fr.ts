export default {
  menu: {
    name: {
      home: 'Accueil',
      buildings: 'Bâtiments',
      species: 'Espèces',
      containers: 'Conteneurs',
      requests: 'Demandes',
      users: 'Utilisateurs',
      compartiments: 'Compartiments',
      form: 'Formulaire',
      view: 'Modélisation'
    },
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
      height: 'Hauteur : ',
      width: 'Longueur : ',
      occupation: 'Occupation : ',
      error: {
        name: 'Le nom ne doit pas être vide',
        value: 'La valeur doit être supérieure à zéro'
      },
      confirmDelete: 'Voulez-vous vraiment supprimer ce compartiment ?'
    },
    container: {
      title: 'Conteneur',
      nameTitle: 'Nom : ',
      description: 'Description : ',
      shape: 'Forme : ',
      areaTitle: 'Surface (en cm²) : ',
      dimensions: 'Dimensions (en cm) : ',
      area: 'Aire',
      errors: {
        nameRequired: 'Le nom ne doit pas être vide',
        shapeRequired: 'La forme ne doit pas être vide',
        dimensionsInvalid: 'Les dimensions doivent être valide pour la forme indiquée',
        dimensionsRequired: 'Les dimensions doivent être renseignées',
        areaRequired: 'La surface doit être supérieure à zéro',
        general: 'Les données du formulaire contiennent des erreurs, vérifiez les champs'
      },
      confirmDelete: 'Voulez-vous vraiment supprimer ce conteneur ?',
      shapes: {
        rectangle: 'Rectangle',
        circle: 'Cercle',
        square: 'Carré',
        triangle: 'Triangle',
        other: 'Autre'
      }
    },
    login: {
      title: "Connexion",
      email: "Email",
      password: "Mot de passe",
      emailPlaceholder: "yourname@domain.com",
      passwordPlaceholder: "********",
      error: "Mauvais identifiant ou mot de passe",
      required: "Ce champ est obligatoire",
      noAccount: "Pas encore de compte ?",
      registerHere: "Inscrivez-vous ici"
    },
    request: {
      title: "Demande de compte utilisateur",
      firstName: "Nom",
      firstNamePlaceholder: "Votre nom",
      lastName: "Prénom",
      lastNamePlaceholder: "Votre prénom",
      email: "Adresse e-mail",
      lab: "Laboratoire (optionnel)",
      labPlaceholder: "Nom du laboratoire",
      reason: "Motif (optionnel)",
      reasonPlaceholder: "Expliquez brièvement votre demande",
      species: "Espèce",
      stage: "Stage",
      subject: "Sujet de la demande",
      quantity: "Quantité",
      temperature: "Temperature",
      photoperiod: "Photoperiode",
      due_date: "Date souhaiter",
      error: {
        fetchSpecies: "Une erreur est survenue dans la recupération des espèces",
        sending: "Une erreur est survenue lors de l'envoie",
        required: "Ne doit pas étre vide",
        greaterThanZero:"Doit étre supérieur a zero",
        notNull: "Doit étre Selectionner",
        invalidEmail:'Email invalide'
      }
    }
  }
};
