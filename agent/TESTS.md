## NER Agent Tests

```
simple-chat-client on  feature/agent [!?] 
➜ curl -X POST -H "Content-Type: application/json" -d '{"message": "find me the entites in the article - headline: Department for International Development"}' http://localhost:8000/ner


"Here are the entities I found in the article \"Department for International Development\".:\n\n*   **2014** - DATE\n*   **West Africa** - LOC\n*   **UK** - GPE\n*   **Department for International Development** - ORG\n*   **DFID** - ORG\n*   **Prime Minister** - ORG\n*   **David Cameron** - PERSON\n*   **Justine Greening** - PERSON\n*   **Secretary of State for International Development** - ORG\n*   **Sierra Leone** - GPE\n*   **DFID** - ORG\n*   **up to three** - CARDINAL\n*   **international** - NORP\n*   **Crown Agents** - ORG\n*   **Conflict, Humanitarian and Security Operations Team** - ORG\n*   **CHASE OT** - ORG\n*   **CHASE OT** - ORG\n*   **DFID** - ORG\n*   **April 2015** - DATE\n*   **Nepal** - GPE\n*   **CHASE OT** - ORG\n*   **24-hour** - TIME\n*   **DFID** - ORG\n*   **John McGhie** - PERSON\n*   **Supply Chain Demand Manager** - ORG\n*   **DFID** - ORG\n*   **World Health Organisation** - ORG\n*   **Sierra Leone** - GPE\n*   **McGhie** - PERSON\n*   **DFID** - ORG\n*   **Whitehall** - ORG\n*   **Ebola** - DISEASE\n*   **PPE** - ORG\n*   **August/September** - DATE\n*   **October** - DATE\n*   **November** - DATE\n*   **500** - CARDINAL\n*   **a week** - DATE\n*   **15** - CARDINAL\n*   **CHASE OT** - ORG\n*   **CHASE OT** - ORG\n*   **Nepal** - GPE\n*   **Yemen** - GPE\n*   **Europe** - LOC\n*   **Syria** - GPE\n*   **Turkey** - GPE\n*   **Ebola** - DISEASE\n*   **McGhie** - PERSON\n*   **CHASE OT** - ORG\n*   **one to three months** - DATE\n*   **Ebola** - DISEASE\n*   **DFID** - ORG\n*   **Crown Agents** - ORG\n*   **IPA** - ORG\n*   **CAIPA** - ORG\n*   **Crown Agents** - ORG\n*   **IPA** - ORG\n*   **70** - CARDINAL\n*   **DFID** - ORG\n*   **DFID** - ORG\n*   **Government of Sierra Leone** - GPE\n*   **Sierra Leone** - GPE\n*   **1%** - PERCENT\n*   **2015** - DATE\n*   **Sierra Leone** - GPE\n*   **November 2015** - DATE\n*   **January of this year** - DATE\n*   **Ebola** - DISEASE\n*   **Sierra Leone** - GPE\n*   **malaria** - DISEASE\n*   **cholera** - DISEASE\n*   **DFID** - ORG\n*   **Sierra Leone** - GPE\n*   **one** - CARDINAL\n*   **8.7%** - PERCENT\n*   **DFID** - ORG\n*   **Sierra Leone** - GPE\n*   **World Health Organisation** - ORG\n*   **Centres for Disease Control and Prevention** - ORG\n*   **Ministry of Defence** - ORG\n*   **Public Health England** - ORG\n*   **National Health Service** - ORG\n*   **Australian Government** - ORG\n*   **Aspen Medical** - ORG\n*   **UK** - GPE\n*   **Ebola** - DISEASE"% 
```

```
simple-chat-client on  feature/agent [!?] took 4.3s 
➜ curl -X POST -H "Content-Type: application/json" -d '{"message": "find me the companies in the article - headline: Department for International Development"}' http://localhost:8000/ner


"The companies mentioned in the article are: Crown Agents, IPA, Aspen Medical."%                                                                                                  

simple-chat-client on  feature/agent [!?] 
➜ curl -X POST -H "Content-Type: application/json" -d '{"message": "find me the companies in the article - headline: Department for International Development"}' http://localhost:8000/ner


"The companies in the article are: Department for International Development (DFID), Crown Agents, Public Health England, National Health Service, Aspen Medical, World Health Organisation, Centres for Disease Control and Prevention, and Ministry of Defence."%  
```

```
simple-chat-client on  feature/agent [!?] 
➜ curl -X POST -H "Content-Type: application/json" -d '{"message": "find me the companies in the article - headline: Greater Nuclear Adoption Needed for AI, AWS CEO Says"}' http://localhost:8000/ner     


"The companies mentioned in the article are: AWS, BBC, Amazon, Energy Northwest, Dominion Energy, and X-energy."%    
```

```
simple-chat-client on  feature/agent [!?] 
➜ curl -X POST -H "Content-Type: application/json" -d '{"message": "find me the companies in the article - headline: Greater Nuclear Adoption Needed for AI, AWS CEO Says"}' http://localhost:8000/ner     


"The companies mentioned in the article are: AWS, BBC, Amazon, Energy Northwest, Dominion Energy, and X-energy."%                                                                                                                    

simple-chat-client on  feature/agent [!?] 
➜ curl -X POST -H "Content-Type: application/json" -d '{"message": "find me the companies in the article - headline: Greater Nuclear Adoption Needed for AI, AWS CEO Says"}' http://localhost:8000/ner


"Here are the companies mentioned in the article:\n\n*   AWS\n*   BBC\n*   Amazon\n*   Energy Northwest\n*   Dominion Energy\n*   X-energy\n*   BizClik"%                                                                            

simple-chat-client on  feature/agent [!?] 
➜ curl -X POST -H "Content-Type: application/json" -d '{"message": "find me the companies in the article - headline: Greater Nuclear Adoption Needed for AI, AWS CEO Says"}' http://localhost:8000/ner


"Here are the companies mentioned in the article:\n\n*   AWS\n*   BBC\n*   Amazon\n*   Energy Northwest\n*   Dominion Energy\n*   X-energy"%  
```