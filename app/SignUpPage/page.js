import SignUp from "../components/SignUp/SignUp";
export const metadata = {
    title: "User SignUp",
    description: "Enter Your Details And The Weight You Want To Reach",
  };

export default function SignUpPage(){
    return(
        <>
        <div>
            <SignUp/>
        </div>
        </>
    )
}