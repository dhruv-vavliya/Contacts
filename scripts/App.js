
import Trie from "./Trie.js";

onload = ()=>{

    /*  Trie structure 
        1. node (root)
            1. cnt = how many strings are pass through
            2. childs = [0,26] next addresses.
            3. number = phone_number when leaf node found.
        2. autocompletes
    */

    const contact_tree = new Trie();
    const searchbar = document.getElementById("searchbar");
    const navSearchBar = document.getElementById("navSearchBar");
    const directory = document.getElementById("autocompletes");

    const home_btn = document.getElementById("home_btn");
    const about_btn = document.getElementById("about_btn");
    const home_page = document.getElementById("home_page");
    const about_page = document.getElementById("about_page");

    const namebar = document.getElementById("namebar");
    const numberbar = document.getElementById("numberbar");
    const removebar = document.getElementById("removebar");

    const addNumber = document.getElementById("addNumber");
    const removeNumber = document.getElementById("removeNumber");
    const clearNumber = document.getElementById("clearNumber");

    const msg = document.getElementById("msg");
    const trigger = document.getElementById("toast");

    // toast a notification
    const toasting = (s ,type )=>{
        msg.innerText = s;
        trigger.classList.add(`bg-${type}`);

        let toast = new bootstrap.Toast(trigger);
        toast.show();        
        setTimeout(() => {
            trigger.classList.remove(`bg-${type}`);            
        }, 6000);
    }
        

    // valid inputs
    namebar.oninput = ()=>{
        namebar.value = namebar.value.toLowerCase();
    }
    removebar.oninput = ()=>{
        removebar.value = removebar.value.toLowerCase();
    }

    const isValid = (s)=>{
        for( let ch of s ){
            if( !(ch>='A' && ch<='Z') && !(ch>='a' && ch<='z') && ch != ' ' ){
                return false;
            }
        }
        return true;
    }

    // add a new contact
    addNumber.onclick = function(){
        const name = namebar.value.trim();
        const number = numberbar.value.trim();

        if( number.length !== 10 ){
            toasting("Invalid Number" ,"warning");
            return;
        }   
        if( name.length <= 2 ){
            toasting("Invalid Name" ,"warning");
            return;
        }   
        if( !isValid(name) ){
            toasting("Only Alphabeticals are Allowed." ,"primary")
            return;
        }
        let point = contact_tree.exist(name); 
        if( point != null && point.number != -1 ){
            numberbar.value = "";
            toasting("ContactName is already exist.","warning");
            return;
        }

        contact_tree.insert( name ,number);
        toasting(`${name} successfully added.`,"success");
        namebar.value = "";
        numberbar.value = "";
    }


    // delete a contact
    removeNumber.onclick = function(){
        const name = removebar.value.trim();
        if( !isValid(name) ){
            toasting("Only Alphabeticals are Allowed.","primary")
            return;
        }
        let point = contact_tree.exist(name); 
        if( point == null || point.number == -1 ){
            toasting("Contact isn't exist","warning");
            return;
        }

        let c = contact_tree.root.childs[contact_tree.getPos(name[0])].cnt;
        contact_tree.remove(name ,0 ,contact_tree.root.childs[contact_tree.getPos(name[0])]);
        if( c == 1 ) contact_tree.root.childs[contact_tree.getPos(name[0])] = null;        
        
        toasting(`${name} successfully deleted`,"danger");
        removebar.value = "";
    }


    // when fire input on searchbar or nav_searchbar.
    searchbar.oninput = ()=>{   
        let name = searchbar.value;
        searchbar.value = name.toLowerCase();
        name = name.trim();

        if( !isValid(name) ){
            directory.style.display = "none";
        }
        
        let point = contact_tree.exist(name);
        if( point == null || name.length == 0 ){
            directory.style.display = "none";
            return;
        }else{
            directory.style.display = "block";
        }
        contact_tree.findAll( point );
        let tot = contact_tree.autocompletes.length;
        directory.innerHTML = "";

        contact_tree.autocompletes.forEach( ([suf ,number] ,pos)=>{
            directory.innerHTML += `
            <div class="contact">
                <img src="./images/person.png" class="person">
                 <div class="details"> 
                    <span><strong>${name}</strong>${suf}</span>
                    <span>${number}</span>
                </div>
                ${ pos < tot-1 ? "</div><hr class='divider'" : "" }
            <div/>
            `            
        } )


        let contacts = document.getElementsByClassName("contact");
        for( let e of contacts ){
            e.addEventListener("click" ,()=>{
                searchbar.value = "";
                searchbar.oninput();
                let cur = e.getElementsByTagName("span")[0].innerText;
                alert(`${cur} is calling :)`);
            })
        }
    }
    navSearchBar.oninput = ()=>{
        searchbar.value = navSearchBar.value;
        searchbar.oninput();
    }


    // cancel searching
    clearNumber.onclick = ()=>{
        searchbar.value = "";
        searchbar.oninput();
    }


    // HTML page switching.
    home_btn.onclick = ()=>{
        about_btn.classList.remove("active");
        home_btn.classList.add("active");
        about_page.style.display = "none";
        home_page.style.display = "block";
    }
    about_btn.onclick = ()=>{
        home_btn.classList.remove("active");
        about_btn.classList.add("active");
        home_page.style.display = "none";
        about_page.style.display = "block";
    }

}