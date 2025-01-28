class Config {
    
    public reviewRepository: ReviewRepository;
    public userRepository: UserRepository;

    constructor() {
        this.reviewRepository = new ReviewRepository(); 
        this.userRepository = new UserRepository();
    }

}