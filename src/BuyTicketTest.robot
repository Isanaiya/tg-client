*** Settings ***
Documentation   View TicketGuru
Library         SeleniumLibrary   15.0   5.0

*** Variables ***
${Browser}      Chrome
${URL}          http://localhost:5173
${Sleep}	3

*** Test Cases ***
View Ticket Page Test Case
        Open Browser    ${URL}       ${BROWSER}
	Sleep	${SLEEP}
        Page Should Contain     Ticket purchase

Buy New Ticket Test Case
        Input Text   	amount  	2
        Input Text    eventId     1
        Input Text    ticketTypeId     1
        Click Button   	xpath:(.//button[contains(., 'Buy')])[last()]
        Page Should Contain     Ticket bought

*** Keywords ***