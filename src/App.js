import './App.css';

const App = () => {

 const [error, setError] = useState(null)

 const [value, setValue] = useState("")

 const [loading, setLoading] = useState(false)



 const Timeout = 120

 const [chatHistory, setChatHistory] = useState([])



 let data;

 //to clear the input field

 const clear = () => {

  setError(null)

  setValue('')

 }







 //options to select randomly from 

 const selectRandomOPtions = [

  "How were you made?",

  "How do i make a pizza ?",

  "What time is it today?",

  "What is the best coding language?",

  "What's your favorite hobby or pastime?",

  "If you could travel anywhere in the world right now, where would you go?",

  "What's the most interesting thing you've learned recently?",

  "Do you prefer reading books or watching movies?",

  "If you could have any superpower, what would it be and why?",

  "What's your go-to comfort food?",

  "If you could meet any historical figure, who would it be and what would you ask them?",

  "What's your favorite way to relax after a long day?",

  "What's the best piece of advice you've ever received?",

  "If you could switch lives with any fictional character for a day, who would it be and what would you do?"

 ]





 const selectRandomly = () => {

  const randomValue = selectRandomOPtions[Math.floor(Math.random() * selectRandomOPtions.length)]

  setValue(randomValue)

 }



 // to fetch the data from the gemini server

 const fetchData = async () => {

  const options = {

   method: 'POST',

   headers: {

    'Content-Type': 'application/json'

   },

   body: JSON.stringify({

    history: chatHistory,

    message: value

   })

  }



  const response = await fetch("https://gemini-server-1kvg.onrender.com/gemini/send-response", options)

  const result = await response.text()

  return result



 }







 const fetchDataAndHandleTimeout = async () => {

  try {

   const result = await Promise.race([

    fetchData(),

    new Promise((resolve) => setTimeout(resolve, Timeout * 1000))

   ]);

   return result;

  } catch (error) {

   setError("Timeout, please check your internet connection");

   setLoading(false);

  }

 }











 // use to send our query to the server`

 const getResponse = async () => {

  if (!value) {

   setError(" Error: please enter a value")

   return

  }



  try {







   //loading while awaiting response 

   setLoading(true)

   // its use to recieve messages from the server

   data = await fetchDataAndHandleTimeout();





   // Format bot response if needed (adjust this according to your response format)

   const formattedRes = data.split('\\n').map((part, index) => <p key={index}>{part}</p>);



   setChatHistory(oldChatHsitory =>

    [...oldChatHsitory, {

     role: "user",

     parts: value

    },

    {

     role: "Geminoid",

     parts: formattedRes

    }]

   )



   setValue('')

   setLoading(false)

  } catch (error) {

   setLoading(false)

   setError("something went wrong")



  }

 }







 const listenEnter = (e) => {

  if (e.key === "Enter") {

   getResponse()

  }

 }



 return (

  <div className="app">

   <h1 className='app-title'>Geminiod</h1>

   <section className='app'>

    <p>

     what do you want to know?

     <button className='suprise-me' onClick={selectRandomly} disabled={!chatHistory || loading}> suprise me </button>

    </p>







    <div className='search-container'>

     <input value={value} placeholder='What is todays weather?' onKeyDown={listenEnter} onChange={e => setValue(e.target.value)}></input>

     {!error && <button className='search-button' onClick={getResponse}>Search</button>}

     {error && <button className='search-button' onClick={clear}>clear</button>

     }



    </div>

    <p>{error}</p>



    <div className='search-result'>

     {

      chatHistory.map((chatItem, _index) => {

       return <div className='Answer' key={_index}>

        <p>

         {chatItem.role} : {chatItem.parts}

        </p>

       </div>



      }



      )

     }



     {loading && (

      <div className='Answer'>

       <div class="spinner"></div>



       </div>

      

     )}



    </div>

   </section>



  </div>

 );



}



export default App;
