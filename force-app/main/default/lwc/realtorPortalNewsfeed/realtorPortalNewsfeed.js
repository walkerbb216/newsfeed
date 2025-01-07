import { LightningElement, track } from 'lwc';

export default class RealtorPortalNewsfeed extends LightningElement {

    @track postMaxLength = 200;
    @track newsfeedCopy;
    @track newsfeedPosts = [
        {id: 1, title: "Post Title 1", text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum"},
        {id: 2, title: "Post Title 2", text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum"}
    ]
    @track total = this.newsfeedPosts.length;

    connectedCallback(){
        this.checkPostLength();
    }

    checkPostLength(){
        this.newsfeedCopy = JSON.parse(JSON.stringify(this.newsfeedPosts));
        this.newsfeedCopy.forEach(post => {
            if(post.text.length > this.postMaxLength){
                post.readmore = true;
                let shortText = post.text.slice(0, this.postMaxLength);
                post.shorttext = shortText + "...";
            } else {
                post.shorttext = post.text;
                post.readmore = false;
            }
        })
    }

    readMore(e){
        try{
            console.log("readmore");
            let dataId = e.target.getAttribute("data-id");
            this.newsfeedCopy.forEach(post => {
                console.log(post.id);
                console.log(dataId);
                if(dataId === JSON.stringify(post.id)){
                    post.shorttext = post.text;
                    post.readmore = false;
                }
            })
        }catch(error){
            console.log(error);
        }
    }

    readLess(e){
        let dataId = e.target.getAttribute("data-id");
        this.newsfeedCopy.forEach(post => {
            if(dataId === JSON.stringify(post.id)){
                if(post.text.length > this.postMaxLength){
                    post.readmore = true;
                    let shortText = post.text.slice(0, this.postMaxLength);
                    post.shorttext = shortText + "...";
                } else {
                    post.shorttext = post.text;
                    post.readmore = false;
                }

            }
        })
    }

}