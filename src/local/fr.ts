export default {
  menu: {
    name: {
      home: 'Accueil',
      buildings: 'Bâtiments',
      species: 'Espèces',
      containers: 'Conteneurs',
      requests: 'Demandes',
      requestsNew: 'Nouvelles demandes',
      requestsAccepted: 'Demandes en cours',
      requestsArchived: 'Demandes archivées',
      users: 'Utilisateurs',
      compartiments: 'Compartiments',
      creation: 'Création',
      ModelingPage: 'Modélisation',
      PlantingPage: 'Plantation',
      new: 'Nouvelles',
      accepted: 'En cours',
      archived: 'Archivées',
      Profile: 'Mes informations',
      PasswordUpdate: 'Modifier mon mot de passe',
      BuildingForm: 'Formulaire du bâtiment',
      compartimentForm: "Formulaire du compartiment",
      SpeciesForm: 'Formulaire de l\'espèces',
      ContainerForm: 'Formulaire du conteneur',
      RequestShow: 'Résumé de la demande',
      ViewSeedsPage: 'vue'
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
    item_per_page: 'Résultats par page : ',
    show: 'Voir',
    finish: 'Terminer',
    logout: 'Déconnexion',
    required: 'Ce champ est obligatoire.',
    no_data: 'Pas de données disponibles.',
    loading: 'Chargement',
    not_assigned: 'Non assigné',
    update: "Mettre à jour"
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
      width: 'Largeur : ',
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
      area: 'Surface',
      errors: {
        nameRequired: 'Le nom ne doit pas être vide',
        shapeRequired: 'La forme ne doit pas être vide',
        dimensionsInvalid: 'Les dimensions doivent être valides pour la forme indiquée',
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
      requester: "Vous êtes demandeur ? Faite une demande en cliquant",
      here: "ici"
    },
    request: {
      title: "Demandes de cultures",
      table: {
        requesterName: "Nom du demandeur",
        email: "Email",
        plant: "Plante",
        quantity: "Quantité",
        dueDate: "Date de début",
        actions: "Actions",
        status: "Statut",
        handler: "Gestionnaire",
        status_trad: {
          pending: "En attente",
          accepted: "En cours",
          refused: "Refusé",
          in_cancelation: "En annulation",
          canceled: "Annulé",
          completed: "Terminé"
        }
      },
      confirmAccept: "Êtes-vous sûr de vouloir accepter cette demande ?",
      confirmReject: "Êtes-vous sûr de vouloir rejeter cette demande ?",
      acceptError: "Erreur lors de l'acceptation de la demande.",
      rejectError: "Erreur lors du rejet de la demande.",
      noRequests: "Aucune demande disponible.",
      firstName: "Prénom",
      firstNamePlaceholder: "Votre prénom",
      lastName: "Nom",
      lastNamePlaceholder: "Votre nom",
      email: "Adresse e-mail",
      lab: "Laboratoire (optionnel)",
      labPlaceholder: "Nom du laboratoire",
      reason: "Description (optionnel)",
      reasonPlaceholder: "Expliquez brièvement votre demande",
      species: "Espèce",
      stage: "Stade",
      subject: "Objet de la demande",
      subjectPlaceholder: "Donnez l'objet de la demande",
      quantity: "Quantité",
      temperature: "Température",
      photoperiod: "Photopériode",
      due_date: "Date de début",
      error: {
        fetchSpecies: "Une erreur est survenue lors de la récupération des espèces",
        sending: "Une erreur est survenue lors de l'envoi, la distribution de cette demande à déjà commencé",
        required: "Ne doit pas être vide",
        greaterThanZero: "Doit être supérieur à zéro",
        notNull: "Doit être sélectionné",
        invalidEmail: 'Email invalide'
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
      error: {
        fetchUsers: "Erreur lors de la récupération des utilisateurs.",
        required: "Ce champ est obligatoire.",
        invalidEmail: "Veuillez entrer une adresse e-mail valide.",
        passwordTooWeak: "Le mot de passe doit comporter au moins 8 caractères.",
        passwordMismatch: "Les mots de passe ne correspondent pas.",
        creationFailed: "Erreur lors de la création de l'utilisateur."
      },
    },
    edit: {
      title: "Modifier la demande",
      firstName: "Prénom",
      firstNamePlaceholder: "Entrez votre prénom",
      lastName: "Nom",
      lastNamePlaceholder: "Entrez votre nom",
      email: "Adresse e-mail",
      lab: "Laboratoire (optionnel)",
      labPlaceholder: "Entrez le nom du laboratoire",
      reason: "Raison (optionnel)",
      reasonPlaceholder: "Expliquez brièvement votre demande",
      species: "Espèce",
      stage: "Stade",
      quantity: "Quantité",
      temperature: "Température",
      photoperiod: "Photopériode",
      due_date: "Date d'échéance",
      subject: "Objet de la demande",
      subjectPlaceholder: "Donnez l'objet de la demande",
      error: {
        required: "Ce champ est requis",
        greaterThanZero: "La valeur doit être supérieure à zéro",
        smallerThanTwentyFive: "La valeur doit être inférieure à 25",
        notNull: "Ce champ ne peut pas être vide",
        invalidEmail: "Adresse e-mail invalide",
        fetchSpecies: "Erreur lors de la récupération des espèces",
        update: "Cette demande ne peut être modifié car elle possède une ou des distributions en cours",
        loadRequest: "Erreur lors du chargement des données de la demande",
      },
      success: "Demande mise à jour avec succès",
      otherSpecies: "Autre",
      plantName: "Nom de la plante",
      plantStageName: "Nom du stade de la plante"
    }
  },
  request: {
    error: {
      fetch: "Une erreur est survenue dans la récupération des requêtes.",
      finish: "Une erreur est survenue lors de la finalisation de cette requête.",
      reject: "Une erreur est survenue lors du rejet de cette demande."
    },
    confirmReject: "Voulez-vous refuser cette demande ?",
    confirmFinish: "Voulez-vous terminer cette demande ?",
    dialog: {
      title: 'Choisissez votre distribution',
      building: 'Choisissez votre bâtiment',
      compartiment: 'Choisissez votre compartiment'
    },
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
    error: {
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
  },
  canvas: {
    benchInfoBox: {
      title: "Modifier la table",
      name: "Nom",
      positionX: "Position X (m)",
      positionY: "Position Y (m)",
      width: "Largeur (m)",
      height: "Hauteur (m)",
      area: "Aire (m²)",
      save: "Enregistrer",
      remove: "Supprimer",
    },
    distributionInfoBox: {
      title: "Modifier la distribution",
      name: "Nom",
      positionX: "Position X (m)",
      positionY: "Position Y (m)",
      width: "Largeur (m)",
      height: "Hauteur (m)",
      potQuantity: "Nombre de plantes",
      area: "Aire (m²)",
      save: "Enregistrer",
      remove: "Supprimer",
    },
    distributionTool: {
      selectPot: "Sélectionner un pot",
      spacings: "Espacement (cm)",
      save: "Enregistrer",
    },
    plantList: {
      title: "Liste des plantes",
    },
    requestInfo: {
      title: "Informations de la demande",
      plantName: "🌱 Nom plante:",
      plantStage: "🔄 Stade plante:",
      plantedAt: "📅 Planté à:",
      requester: "👤 Demandeur:",
    },
    tools: {
      add: "Ajouter",
      edit: "Modifier",
      move: "Déplacer",
      select: "Sélectionner",
    },
    modeling: {
      save: "Enregistrer",
    },
    error: {
      benchOverlap: "La table est en chevauchement avec une autre table.",
      distributionOverlap: "La distribution est en chevauchement avec une autre distribution.",
      distributionOutside: "La distribution est en dehors de la table.",
      unselectPot: "Veuillez sélectionner le pot avant d'ajouter la distribution",
      failedToSave: "Erreur lors de l'enregistrement.",
      failedToAccept: "Erreur lors de l'acceptation.",
      unableToDeleteDistributionIfIsNotAssociatedWithRequest: "Impossible de supprimer la distribution car elle n'est pas associé à cette demande.",
      invalidDistributionPosition: "La position de la distribution est invalide.",
      potQuantityMustGreaterThanZero: "La quantité de pot doit être supérieure à zéro"
    }
  },
};
