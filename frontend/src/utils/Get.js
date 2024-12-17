

export const Get=async(url)=>{
    let data={};

    let response;
  try {
       response=await fetch(url);
       data =await response.json();
  } catch (error) {
    // throw new Error(error.message || "An error occurred");
  }
 
    return data

}

