
// node structure : next_addresses + phone_number
class Node{
    constructor(){
        this.childs = Array(27).fill(null);
        this.cnt = 0;
        this.number = -1;
    }
}


// Trie data structure
export default class Trie{
    
    constructor(){
        this.root = new Node();
        this.autocompletes = [];
    }       

    getPos(ch){
        if( ch == ' ' ) return 26;
        return ch.charCodeAt(0) - 97;
    }
    getChar(pos){
        if( pos == 26 ) return ' ';
        return String.fromCharCode(pos + 97);
    }

    // Insert a Contact
    insert( name ,number ){
        let n = name.length;

        let point = this.root;
        for( let i=0 ;i<n ;i++ ){
            if( point.childs[this.getPos(name[i])] === null ){
                point.childs[this.getPos(name[i])] = new Node();
            }
            point = point.childs[this.getPos(name[i])];
            point.cnt++;
        }
        point.number = number;
    }


    // Name Exist or not?
    // return endpoint
    exist( name ){
        let n = name.length;

        let point = this.root;
        for( let i=0 ;i<n ;i++ ){
            if( point.childs[this.getPos(name[i])] == null ){
                return null;
            }
            point = point.childs[this.getPos(name[i])];
        }
        return point;
    }


    // Delete a Contact
    remove( name ,pos ,point ){
        if( pos == name.length ){
            return;
        }

        if( pos+1 < name.length ){
            this.remove(name ,pos+1 ,point.childs[this.getPos(name[pos+1])] );
        }
        point.cnt--;
        if( point.cnt == 0 ){
            delete point.childs;
            delete point.cnt;
            delete point.number;
        }
    }   

    // Fetch all prefix-matched Contacts
    // Algorithm : DFS ( Backtracking )
    dfs( point ,name ){
        for( let i=0 ;i<=26 ;i++ ){
            if( point.childs[i] ){
                this.dfs( point.childs[i] ,name + this.getChar(i) );
            }
        }

        if( point.number != -1 ){
            this.autocompletes.push([name ,point.number]);
        }
    }


    // Find all Descendents
    findAll( point ){
        while( this.autocompletes.length > 0 ) this.autocompletes.pop();
        this.dfs( point ,"" );
    }

}

