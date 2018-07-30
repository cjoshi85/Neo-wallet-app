import * as firebase from "firebase";
import { USER_REGULAR, USER_ADVANCE } from '../../actions/wallet'

export async function user_login(email, password) {

   
    let result = null
    let user=null

    alert(email)
  //  firebase.auth().setPersistence(firebase.auth.Auth.Persistence.NONE);

    const response = await firebase.auth().signInWithEmailAndPassword(email, password);

    if (response) {

        user = await firebase.auth().currentUser
    }
    if (user) {
       // alert('uid'+user.uid)
        result =
            {
                user
            }
    }

    return result
} 

export async function userSignup(email,password){
    const response = await firebase.auth().createUserWithEmailAndPassword(email, password);
    let user = null
    let result = null
    if (response) {

        user = await firebase.auth().currentUser
    }
    if (user) {
        result =
            {
                user
            }
    }

    return result
}

export function saveUser(user,email,password,phone){
    
    let userMobilePath = "/user/" + user.uid + "/details";

    return firebase.database().ref(userMobilePath).set({
        email: email,
        password: password,
        phone: phone
    })
}

export async function logoutUser(){
   
   alert('Entered')
    const res=await firebase.auth().signOut()


}

export async function currentuser(){

  const user=await firebase.auth().currentUser
    if(user){
        result =user.uid
    }

    return result
}

export async function getUserRole(userId){
    let rolePath = "/roles/" + userId;

    // alert(userId)

   var snapshot=await firebase.database().ref(rolePath).once('value')
        
    return snapshot.val().role
}

export async function getCurrencyCode(userId){
    let currencyPath="/countrycode/"+ userId;
    var snapshot=await firebase.database().ref(currencyPath).once('value')
    
    return snapshot.val().countrycode
}

export async function getUserData(userId){
    try{
    let userPath="/user/"+ userId+"/details";
    var snapshot=await firebase.database().ref(userPath).once('value')
    debugger
    
    return snapshot.val().username
    }catch(error){
        console.error(error)
    }
}

export async function updateUserRole(userId,roleType){

    let userMobilePath = "/roles/" + userId;

    toggleRole=(roleType===USER_REGULAR)?USER_ADVANCE:USER_REGULAR
    debugger

    return firebase.database().ref(userMobilePath).update({
        role:toggleRole
    })
}

export async function updateCurrency(userId,currency){
    let currencyPath="/countrycode/"+userId;
    debugger
    firebase.database().ref(currencyPath).update({
        countrycode:currency
    })

    return currency
}

export async function getAllAdress(userId){
    let addressPath = "/wallet/"+userId;

    // alert(userId)
    let items = [];

    let snapshot = await firebase.database().ref(addressPath).orderByKey().once('value');
    snapshot.forEach(function(childSnapshot) {
      var childKey = childSnapshot.val();
      items.push(childKey.address);
    }); 
 
    return items
}