import { LightningElement, track } from 'lwc';

export default class RealtorPortalNewsfeed extends LightningElement {

    @track perPage = 5;
    @track currentPage = 1;
    @track nextBtn;
    @track prevBtn;
    @track postMaxLength = 200;
    @track newsfeedCopy;
    @track newsfeedPosts = [
        {id: 1, title: "Post Title 1", text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum"},
        {id: 2, title: "Post Title 2", text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum"},
        {id: 3, title: "Post Title 3", text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum"},
        {id: 4, title: "Post Title 4", text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum"},
        {id: 5, title: "Post Title 5", text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum"},
        {id: 6, title: "Post Title 6", text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum"},
        {id: 7, title: "Post Title 7", text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum"},
        {id: 8, title: "Post Title 8", text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum"},

    ]

    @track startIndex;
    @track endIndex;
    @track total = this.newsfeedPosts.length;
    @track currStart;

    getCurrPosts(){
        this.getEndIndex(this.currentView, this.perPage);
        this.currStart = (this.startIndex + 1) + " - " + (this.endIndex);
    }

    connectedCallback(){
        this.checkPostLength();
        this.currentView = JSON.parse(JSON.stringify(this.paginate(this.newsfeedCopy, this.currentPage, this.perPage)));
        this.totalPages = Math.ceil(this.newsfeedCopy.length / 5);
        if(this.totalPages > 1){
            this.nextBtn = true;
        }
        this.getCurrPosts();
    }

    paginate(items, page, perPage) {
        this.startIndex = (page - 1) * perPage;        
        this.endIndex = this.startIndex + perPage;
        return items.slice(this.startIndex, this.endIndex);
    }

    getEndIndex(items, perPage){
        if(items.length < perPage){
            this.endIndex = this.startIndex + items.length;
        }else {
            this.endIndex = this.startIndex + perPage;
        }
    }

    handleNext(){
        if(this.currentPage === this.totalPages){
            return;
        }
        this.currentPage = this.currentPage + 1;
        this.currentView = JSON.parse(JSON.stringify(this.paginate(this.newsfeedCopy, this.currentPage, this.perPage)));
        this.getCurrPosts();
        this.checkBtn();
        this.goToTop();
    }

    handlePrev(){
        this.currentPage = this.currentPage - 1;
        this.currentView = JSON.parse(JSON.stringify(this.paginate(this.newsfeedCopy, this.currentPage, this.perPage)));
        this.getCurrPosts();
        this.checkBtn();
        this.goToTop();
    }

    checkBtn(){
        if(this.currentPage > 1){
            this.prevBtn = true;
        } else {
            this.prevBtn = false;
        }
        if(this.endIndex === this.total){
            this.nextBtn = false;
        } else {
            this.nextBtn = true;
        }
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
            let dataId = e.target.getAttribute("data-id");
            this.newsfeedCopy.forEach(post => {
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


    goToTop(){
        window.scrollTo({
            top: 0,
        })
    }


}