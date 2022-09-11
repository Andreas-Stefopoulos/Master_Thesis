import { BASE_URL } from "../constants";
import moment from 'moment';

export const getMapData = (fromDate, toDate, type) =>{
    
    console.log("fromDate", fromDate, "toDate", toDate, "type", type);

    let fD = fromDate.split(" ");
    let tD = toDate.split(" ");

    let fromDataWithTime = `${fD} 00:00:00`;
    let toDataWithTime = `${tD} 23:59:59`;

    console.log("fromDataWithTime", fromDataWithTime, "toDataWithTime", toDataWithTime);

    var config = {
      method: 'GET',
      
      headers: { 
        'Authorization': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjksInVzZXJOYW1lIjoic2hpdmkxMjUiLCJlbWFpbCI6InJpc2hhYmhAY3liZXJ0cm9ucy5pbiIsInBob25lTnVtYmVyIjoiOTk5IiwidXNlclR5cGUiOjIsImlhdCI6MTYzMzU4MzQ4Mn0.fyeZ_pWFt6PmeQVJEJqEBmBTtJmHuDM1YBIwfKyteuI',
          
    }
    };
  
  
    return fetch(`${BASE_URL}/getData?from=${fromDataWithTime}&to=${toDataWithTime}&type=${type}`, config)
    .then(response => 
      {
        if(response.status === 200){
            return response.json()
        } else{
            return null
        }   
    }
      ).catch(error =>{
      console.log("Error in gettinMyDetails: ",error);
    });
}

export const getMapDataByFilter = (fromDate, toDate) =>{

  
  let fD = fromDate.split(" ");
  let tD = toDate.split(" ");

  let fromDataWithTime = `${fD} 00:00:00`;
  let toDataWithTime = `${tD} 23:59:59`;

    var config = {
      method: 'GET',
      ,
      headers: { 
        'Authorization': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjksInVzZXJOYW1lIjoic2hpdmkxMjUiLCJlbWFpbCI6InJpc2hhYmhAY3liZXJ0cm9ucy5pbiIsInBob25lTnVtYmVyIjoiOTk5IiwidXNlclR5cGUiOjIsImlhdCI6MTYzMzU4MzQ4Mn0.fyeZ_pWFt6PmeQVJEJqEBmBTtJmHuDM1YBIwfKyteuI',
        ,   
    }
    };
  
  
    return fetch(`${BASE_URL}/getData?from=${fromDataWithTime}&to=${toDataWithTime}&type=1`, config)
    .then(response => 
      {
        if(response.status === 200){
            return response.json()
        }  else{
            return null
        }  
    }
      ).catch(error =>{
      console.log("Error in gettinMyDetails: ",error);
    });
}


export const getMinMaxDatesMap = (fromDate, toDate) =>{
    
    var config = {
      method: 'GET',
      
      headers: { 
        'Authorization': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjksInVzZXJOYW1lIjoic2hpdmkxMjUiLCJlbWFpbCI6InJpc2hhYmhAY3liZXJ0cm9ucy5pbiIsInBob25lTnVtYmVyIjoiOTk5IiwidXNlclR5cGUiOjIsImlhdCI6MTYzMzU4MzQ4Mn0.fyeZ_pWFt6PmeQVJEJqEBmBTtJmHuDM1YBIwfKyteuI',
         
    }
    };
    
    return fetch(`${BASE_URL}/getDates`, config)
    .then(response => 
      {
        if(response.status === 200){
            return response.json()
        }else{
            return null
        }
    }
      ).catch(error =>{
      console.log("Error in gettinMyDetails: ",error);
    });
}