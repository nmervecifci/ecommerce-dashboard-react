import React from "react";
import search from "../../../src/assets/images/search_icon.svg";
import notification from "../../../src/assets/images/notification.svg";
import email from "../../../src/assets/images/email_icon.svg";
import profile from "../../../src/assets/images/profile_icon.png";
function Header() {
  return (
    <div className="bg-[#F2F9F7] w-full flex flex-row items-center justify-between gap-16">
      {/*Left Side*/}
      <div className="mx-16">
        <p className="text-gray-500">Good Morning,</p>
        <h1 className="font-bold">Merve Nur Cifci</h1>
      </div>
      {/*Right Side*/}
      <div className="flex items-center gap-4 cursor-pointer">
        <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center">
          <img src={search} alt="" />
        </div>
        <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center">
          <img src={notification} alt="" width={20} />
        </div>
        <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center">
          <img src={email} alt="" />
        </div>
        <div className="px-4 py-6 bg-yellow-500 rounded-2xl flex flex-row justify-center gap-3">
          <div>
            <img src={profile} alt="" width={30} />
          </div>
          <div>
            <h1 className="text-sm font-bold">Merve Nur Cifci</h1>
            <p className="text-xs font-normal">test@gmail.com</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Header;
