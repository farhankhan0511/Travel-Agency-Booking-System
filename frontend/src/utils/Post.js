

export const Post=async(url,options)=>{
    let data={};
   
    let response;
  try {
       response=await fetch(url,options);
       data =await response.json();
  } catch (error) {
    throw new Error(error.message || "An error occurred");

  }
  if(!response?.ok){
    throw new Error(data.message || "An error occurred");
  }
    return {data,message}

}
