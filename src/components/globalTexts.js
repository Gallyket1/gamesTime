export const NO_GAIN = "Pas de chance cette fois ! \n \n La prochaine fois sera la bonne !"

export function gain(text){
  return `Félicitations ! \n \n Vous avez gagné ${text} \$`
}

export const INSTRUCTION = " Jouez avec 5 numéros et un lucky emoji !"

export const MISE = "Mise"

export const BAD_COMBINATION = "Veuillez sélectionner 5 numéros \n et un lucky emoji !"

export const ALREADY_FIVE = "Vous avez déjà sélectionné 5 numéros !"
export const JACKPOT_ANNOUNCEMENT = "Gagnez jusqu'à 4500 $";

export const NOT_PARTICPATING = "Vous n'avez pas participé au tirage \n " +
  "précédent"

export const NOT_ENOUGH_MONEY = "Votre budget est insuffisant ! \n " +
  "Veuillez ajouter de l'argent."

export function won(amount, gameName){
  return `Vous avez gagné ${amount} $ à ${gameName}`
}

export function lost(amount, gameName){
  return `Vous avez perdu ${amount} $ à ${gameName}`
}
export function bonus(amount, gameName){
  return `Vous avez obtenu un bonus de ${amount} $ à ${gameName}`
}
export function resultIntrus(score){
  return `Score final: ${score} %`
}

export function notifIntrus(score){
  return `Vous avez obtenu un score de ${score} % à l'intrus malin`
}
