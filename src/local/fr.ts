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
      creation: 'Création',
      view: 'Modélisation',
      information: 'Information',
      profile: 'Mes informations',
      password: 'Modifier mon mot de passe',
    },
  },
  common: {
    edit: 'Modifier',
    save: 'Enregistrer',
    cancel: 'Annuler',
    add: 'Ajouter',
    send: 'Envoyer',
    delete: 'Supprimer',
    accept: 'Accepter',
    reject: 'Refuser',
    actions: 'Actions',
    item_per_page: 'Résultat par page : ',
    information: 'Information',
    logout: 'Déconnexion',
    required: 'Ce champ est obligatoire',
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
      title: "Demandes de cultures",
      table: {
        requesterName: "Nom du demandeur",
        email: "Email",
        plant: "Plante",
        quantity: "Quantité",
        dueDate: "Date souhaitée",
        actions: "Actions"
      },
      confirmAccept: "Êtes-vous sûr de vouloir accepter cette demande ?",
      confirmReject: "Êtes-vous sûr de vouloir rejeter cette demande ?",
      acceptError: "Erreur lors de l'acceptation de la demande.",
      rejectError: "Erreur lors du rejet de la demande.",
      noRequests: "Aucune demande disponible.",
      firstName: "Nom",
      firstNamePlaceholder: "Votre nom",
      lastName: "Prénom",
      lastNamePlaceholder: "Votre prénom",
      email: "Adresse e-mail",
      lab: "Laboratoire (optionnel)",
      labPlaceholder: "Nom du laboratoire",
      reason: "Description (optionnel)",
      reasonPlaceholder: "Expliquez brièvement votre demande",
      species: "Espèce",
      stage: "Stade",
      subject: "Objet de la demande",
      subjectPlaceholder: "Donner l'objet de la demande",
      quantity: "Quantité",
      temperature: "Température",
      photoperiod: "Photopériode",
      due_date: "Date souhaitée",
      error: {
        fetchSpecies: "Une erreur est survenue dans la recupération des espèces",
        sending: "Une erreur est survenue lors de l'envoi",
        required: "Ne doit pas être vide",
        greaterThanZero:"Doit être supérieur a zero",
        notNull: "Doit être Selectionné",
        invalidEmail:'Email invalide'
      },
      success: "Votre demande a été envoyée avec succès !"
    },
    user: {
      title: 'Utilisateurs',
      table: {
        name: 'Nom',
        email: 'Email',
        role: 'Rôle',
        actions: 'Actions'
      },
      confirmDelete: 'Voulez-vous vraiment supprimer cet utilisateur ?',
      deleteError: 'Erreur lors de la suppression de l\'utilisateur',
      firstName: 'Prénom',
      lastName: 'Nom',
      email: 'Email',
      password: 'Mot de passe',
      confirmPassword: 'Confirmez le mot de passe',
      lastNamePlaceholder: 'Nom de famille',
      firstNamePlaceholder: 'Prénom',
      emailPlaceholder: 'Adresse e-mail',
      passwordPlaceholder: 'Mot de passe',
      confirmPasswordPlaceholder: 'Confirmez le mot de passe',
      error : {
        fetchUsers: "Erreur lors de la récupération des utilisateurs.",
        required: "Ce champ est obligatoire.",
        invalidEmail: "Veuillez entrer une adresse e-mail valide.",
        passwordTooWeak: "Le mot de passe doit comporter au moins 8 caractères.",
        passwordMismatch: "Les mots de passe ne correspondent pas.",
        creationFailed: "Erreur lors de la création de l'utilisateur."
      },
    }
  },
  profile: {
    title: "Mes informations personnelles",
    firstName: "Prénom",
    lastName: "Nom",
    email: "Email",
    firstNamePlaceholder: "Votre prénom",
    lastNamePlaceholder: "Votre nom",
    updatePassword: "Modifier le mot de passe",
    delete: "Supprimer mon compte",
    error : {
      required: "Ce champ est obligatoire."
    },
    successUpdate: "Vos informations ont été mises à jour avec succès !",
    errorUpdate: "Erreur lors de la mise à jour de vos informations.",
    confirmDelete: "Voulez-vous vraiment supprimer votre compte ?",
    errorDelete: "Erreur lors de la suppression de votre compte."
  },
  password: {
    title: "Modifier le mot de passe",
    currentPassword: "Mot de passe actuel",
    currentPasswordPlaceholder: "Votre mot de passe actuel",
    newPassword: "Nouveau mot de passe",
    newPasswordPlaceholder: "Votre nouveau mot de passe",
    confirmPassword: "Confirmez le mot de passe",
    confirmPasswordPlaceholder: "Confirmez votre nouveau mot de passe",
    updateButton: "Mettre à jour",
    resetButton: "Réinitialiser",
    successUpdate: "Votre mot de passe a été mis à jour avec succès.",
    errorUpdate: "Erreur lors de la mise à jour du mot de passe.",
    minLength: "Le mot de passe doit contenir au moins {length} caractères.",
    passwordMismatch: "Les mots de passe ne correspondent pas.",
  }
};
