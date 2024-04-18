import bot from "./assets/dalle_bot.jpg";
import user from "./assets/vt_student.jpg";
const form = document.querySelector("form");
const chatContainer = document.querySelector("#chat_container");

let loadInterval;

function loader(element) {
  element.textContent = "";

  loadInterval = setInterval(() => {
    element.textContent += ".";
    if (element.textContent === "....") {
      element.textContent = "";
    }
  }, 300);
}

function typeText(element, text) {
  let index = 0;

  let interval = setInterval(() => {
    if (index < text.length) {
      element.innerHTML += text.charAt(index);
      chatContainer.scrollTop = chatContainer.scrollHeight;
      ++index;
    } else {
      clearInterval(interval);
    }
  }, 20);
}
document.addEventListener('DOMContentLoaded', async function () {


  const data = new FormData(form);
  const prompt = data.get("prompt").trim();


  // if (prompt === "") {
  //   form.reset();
  //   return;
  // }
  // user's chatstripe
  // chatContainer.innerHTML += chatStripe(false, prompt);

  form.reset();

  // bot's chatstripe, initially blank
  const uniqueId = generateUniqueId();
  chatContainer.innerHTML += chatStripe(true, " ", uniqueId);

  chatContainer.scrollTop = chatContainer.scrollHeight;

  const messageDiv = document.getElementById(uniqueId);
  loader(messageDiv);


  try {
    const chatGPTResponse = await InitialMessageToChatGPT();
    clearInterval(loadInterval);
    messageDiv.innerHTML = "";

    if (chatGPTResponse.choices && chatGPTResponse.choices.length > 0) {
      const replyText = chatGPTResponse.choices[0].message.content;
      typeText(messageDiv, replyText);
    } else {
      messageDiv.innerHTML = "Failed to get a response";
    }
  } catch (error) {
    clearInterval(loadInterval);
    messageDiv.innerHTML = "Error: " + error.toString();
    console.error("Error when calling OpenAI:", error);
  }


});

function generateUniqueId() {
  const timestamp = Date.now();
  const randomNumber = Math.random();
  const hexadecimalString = randomNumber.toString(16);

  return `id-${timestamp}-${hexadecimalString}`;
}

function chatStripe(isAi, value, uniqueId) {
  return `
    <div class="wrapper ${isAi && "ai"}">
      <div class="chat">
        <div class="profile">
          <img
            src="${isAi ? bot : user}"
            alt="${isAi ? "bot" : "user"}"
          />
        </div>
        <div class="message" id=${uniqueId}>${value}</div>
      </div>
    </div>
  `;
}

const handleSubmit = async (e) => {
  e.preventDefault();

  const data = new FormData(form);
  const prompt = data.get("prompt").trim();

  if (prompt === "") {
    form.reset();
    return;
  }

  // user's chatstripe
  chatContainer.innerHTML += chatStripe(false, prompt);

  form.reset();

  // bot's chatstripe, initially blank
  const uniqueId = generateUniqueId();
  chatContainer.innerHTML += chatStripe(true, " ", uniqueId);

  chatContainer.scrollTop = chatContainer.scrollHeight;

  const messageDiv = document.getElementById(uniqueId);
  loader(messageDiv);

  // Fetch data from ChatGPT model
  try {
    console.log('hii');
    const chatGPTResponse = await sendMessageToChatGPT(prompt);
    clearInterval(loadInterval);
    messageDiv.innerHTML = ""; // Clear loader

    if (chatGPTResponse.choices && chatGPTResponse.choices.length > 0) {
      const replyText = chatGPTResponse.choices[0].message.content;
      typeText(messageDiv, replyText);
    } else {
      messageDiv.innerHTML = "Failed to get a response";
    }
  } catch (error) {
    clearInterval(loadInterval);
    messageDiv.innerHTML = "Error: " + error.toString();
    console.error("Error when calling OpenAI:", error);
  }
};

form.addEventListener("submit", handleSubmit);

form.addEventListener("submit", handleSubmit);
form.addEventListener("keyup", (e) => {
  if ("keyup" === 13) {
    handleSubmit(e);

  }
});

async function sendMessageToChatGPT(prompt) {
  messageHistory.push({ role: "user", content: prompt });
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer sk-proj-Ngql6jiswE5FCKsdhY4OT3BlbkFJqsGFAC9z7SQU6xs1d7Ma'
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: messageHistory
    })
  });
  const data = await response.json();
  if (data.choices && data.choices.length > 0) {
    const replyText = data.choices[0].message.content;
    messageHistory.push({ role: "assistant", content: replyText }); // Add bot reply to history
  }
  return data;
}
var quest = ` You are a counselor in the College of Engineering specifically in Computer Science at the real college called Virginia Polytechnic Institute and State University
or Virginia Tech for short. You specialize in helping students by guiding and giving resources 
about college work and classes and how to deal with them. 

You will adhere to a consistent style of talking that is appropriate of a professional adult working a college job.

Your task is to provide answers to student's question in the text given as such a counselor by:

1. Start with a greeting to the system by saying:"Hi! Welcome to Mindcraft VT Assistant! 

2. Then say "Ask me any questions regarding these three topics:"

3. Answer the user's question in regards to three different categories. Do not display details of categories or info on them. Presume they have some form of idea.
This is for your knowledge only. Details below in these categories are to give you a better idea of what each category is specifically about.
These categories are:

- Social Life: This is essentially about on going campus events at Virginia Tech, what you can do as a college student on campus in and out of
campus and outside in Blacksburg and nearby Christiansburg and Roanoke in Virginia. This also includes how to have fun with friends, groups, joining organizations
and clubs, and doing all sorts of events and getting involved with extracurriculars. This includes stuff from Gobblerconnect, a website that hosts event listinngs and club/organization listings
you can join and in general calendars you can find by email like listserv notifications from organizations, and calendars embedded into the Virginia Tech college website
and the calendar found on google or others found from related websites

- Academics: This is essentially about courses, information on courses such as knowing what teacher is teaching or general heuristic knowledge about the class like 
what they teach and how long each class is. This also can be about how to sign up for such a class, the steps to sign up, prerequisites, among ther logistical knowledge
that is involved with courses. This can be about majors, pricing for credits, and anything related to classes, graduation, or a student's learning. This topic can also be
a way to guide students on how to survive classes in general and strategies to survive and thrive in classes. Important deadlines and there important heuristics that 
are constantly updates are listed here.

- Wellness: This is essentially all about resources for students. They can be exisiting outside and inside campus resources. These resources include anything regarding 
mental health, physical health, disability services, food and dietary support, financial aid and support, housing information and costs of living, and anything in general
that regards useful everyday resources to help with the students needs that are listed currently on Virginia Tech on the websites and other affiliated resources. 

If they are not in these categories OR they are out of the scope of what you can give users then say:
"Sorry I don't believe I am able to answer your question in regards. Would you mind rewording your question or 
answering a different one? If not thank you for using our service!:D"

4.  The output of your response should be first with a introductory paragraph of what your found. Then in a list format of 
bullet points show all of the options, details, etc in terms of what you were trying to answer, BUT do not do this for most prompts if 
it seems explicitly not needed. Instead if not needed, write in about 4-5 paragraphs explaining what you found. Finally have one final paragraph summarizing 
the answer you found and then the final question where you ask the user specifically:
"Does this answer your question?"

5. Following step 3 for the text "Does this answer your question?" If they say anything similar to the word "Yes" within context then say:
"Hope this was helpful!" If the user says "No", prompt the user by saying: "Sure! What else do you want to know or need clarification about?" Proceed
to then follow the previous steps starting from step 2. Use the question before as guidance and keep on topic. If they give an answer not on or similar to
said topic or within the category then say "Sorry I don't believe I am able to answer your question in regards. Would you mind rewording your question or 
answering a different one? If not thank you for using our service!:D`;
let messageHistory = [];
async function InitialMessageToChatGPT() {
  chatContainer.innerHTML = '';
  messageHistory = [];
  const initialPrompt = quest;
  messageHistory.push({ role: "system", content: initialPrompt });
  console.log(messageHistory)
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer sk-proj-Ngql6jiswE5FCKsdhY4OT3BlbkFJqsGFAC9z7SQU6xs1d7Ma'
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: messageHistory
    })
  });
  const data = await response.json();
  if (data.choices && data.choices.length > 0) {
    const replyText = data.choices[0].message.content;
    const uniqueId = generateUniqueId();
    chatContainer.innerHTML += chatStripe(true, replyText, uniqueId);
    messageHistory.push({ role: "assistant", content: replyText });
  } else {
    console.error("Failed to get a valid response from the API.");
    chatContainer.innerHTML += `<div>Error: Failed to get a response from the assistant.</div>`;
  }
  return data;
}
