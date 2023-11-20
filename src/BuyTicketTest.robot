*** Settings ***
Documentation   View TicketGuru
Library         SeleniumLibrary   15.0   5.0

*** Variables ***
${Browser}      Chrome
${URL}          http://localhost:5173
${Sleep}	      3

*** Test Cases ***
View Ticket Page Test Case
        Open Browser    ${URL}       ${BROWSER}
	      Sleep	  ${Sleep}
        Page Should Contain     Ticket purchase

Buy New Ticket Test Case
        Input Text  amount   2 
        Click Element   id:event-select 
        Sleep   ${Sleep}
        Click Element   xpath://li[contains(.,'Concert - 2023-10-20')] 
        Click Element   id:ticketType-select 
        Sleep   ${Sleep}
        Click Element   xpath://li[contains(.,'Student - Discount for students')] 
        Click Button  xpath://button[contains(., 'Buy')]
        Sleep   ${Sleep}
        Page Should Contain   Purchase successful!

*** Keywords ***