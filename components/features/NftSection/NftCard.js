import Image from "next/image";
import React from "react";
import { useContext } from "react";
import { NftContext } from "../../../context/NftContext";
import { useState } from "react";
import SweetAlert from "react-bootstrap-sweetalert";
import { useEffect } from "react";
import useJoinCampaign from "../../walletFunctions/joinCampaignFunction";
import { GetWinnerWhenExpired } from "./GetWinnerWhenExpired";
import useUpdateTimeToShow from "./useUpdateTimeToShow";

const NftCard = ({
  nftSrc,
  campaignId,
  creator,
  totalEntriesStart,
  totalEntriesEnd,
  entryCost,
  contractAccount,
  isVideo,
  videoNftUrl,
  assetId,
  joinedAccounts,
  route,
  finalUTCEpochTimeInMilliSec,
}) => {
  const { userAccount, userAccountLogin, setUserLoginProvider } =
    useContext(NftContext);

  const {
    joinCampaign,
    joinErrorMessage,
    isTransactionSussessful,
    setIsTransactionSussessful,
    transactionId,
  } = useJoinCampaign();

  const [showAlert, setShowAlert] = useState(false);
  const [showTransactionMessage, setShowTransactionMessage] = useState(false);
  const [showWinner, setShowWinner] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [openModal, setOpenModal] = useState(true);
  const [timeCountDown, setTimeCountDown] = useState(15);
  const [userLoginPopup, setUserLoginPopup] = useState(false);

  useEffect(() => {
    if (transactionId) {
      setShowTransactionMessage(true);
      setShowErrorMessage(false);
    } else if (joinErrorMessage) {
      setShowErrorMessage(true);
      setShowTransactionMessage(false);
    }
  }, [transactionId, joinErrorMessage]);

  const { timeToShow } = useUpdateTimeToShow(finalUTCEpochTimeInMilliSec);

  return (
    <>
      <SweetAlert
        title={"Connect Wallet"}
        show={userLoginPopup}
        showConfirm={false}
        onConfirm={() => {}}
        style={{ color: "white", background: "#1d2228" }}
        onCancel={() => {
          setUserLoginPopup(false);
        }}
      >
        <div className="flex flex-col">
          <button
            style={{ background: "#14181d" }}
            className="flex items-center justify-between px-3 py-1 my-4"
            onClick={() => {
              setUserLoginProvider("wax");
              setUserLoginPopup(false);
              userAccountLogin();
            }}
          >
            <p>Wax Cloud Wallet </p>
            <img width={70} src="/media/waxLogoPng.png" />
          </button>
          <button
            style={{ background: "#14181d" }}
            onClick={() => {
              setUserLoginProvider("anchor");
              setUserLoginPopup(false);
              userAccountLogin();
            }}
            className="flex items-center justify-between px-3 py-1"
          >
            <p>Anchor </p> <img width={40} src="/media/anchor_logo.svg" />
          </button>
        </div>
      </SweetAlert>

      <SweetAlert
        custom
        title=""
        show={showAlert}
        onConfirm={() => {}}
        style={{ backgroundColor: "#1d2228", color: "white" }}
        customButtons={
          <>
            <button
              onClick={async () => {
                await joinCampaign(
                  contractAccount,
                  campaignId,
                  entryCost,
                  route,
                  joinedAccounts,
                  totalEntriesStart
                ).then(() => {
                  setShowAlert(false);
                });
              }}
              style={{ backgroundColor: "#5f5dbb" }}
              className=" px-6 py-3 mx-2 rounded-lg"
            >
              SEND
            </button>

            <button
              onClick={() => {
                setShowAlert(false);
              }}
              style={{ backgroundColor: "#6e7881" }}
              className=" px-6 py-3 mx-2 rounded-lg"
            >
              CANCEL
            </button>
          </>
        }
      >
        {!isVideo ? (
          <>
            <Image
              height={110}
              width={"100%"}
              loading="lazy"
              src={nftSrc}
              objectFit={"fill"}
              layout={"responsive"}
            />
          </>
        ) : (
          <video
            width={"100%"}
            className="video_nft object-cover"
            muted
            autoPlay
            controls=""
          >
            <source src={videoNftUrl} type="video/mp4" />
            <source src={videoNftUrl} type="video/ogg" />
          </video>
        )}

        <p className="pt-5">
          To participate in this Campaign ID : {campaignId} you&apos;re about to
          send {entryCost}
        </p>
      </SweetAlert>

      {isTransactionSussessful ? (
        <SweetAlert
          success
          show={showTransactionMessage}
          style={{ color: "white", backgroundColor: "#1d2228" }}
          title="Successfully Joined!"
          onConfirm={() => {}}
          customButtons={
            <>
              <button
                onClick={() => {
                  setIsTransactionSussessful(false);
                }}
                style={{ backgroundColor: "#5f5dbb" }}
                className=" px-6 py-3"
              >
                OK
              </button>
            </>
          }
        >
          <p>Transaction Id : {transactionId} </p>
        </SweetAlert>
      ) : joinErrorMessage ? (
        <SweetAlert
          danger
          show={showErrorMessage}
          style={{ backgroundColor: "#1d2228", color: "white" }}
          title=""
          onConfirm={() => {}}
          customButtons={
            <>
              <button
                onClick={() => {
                  setShowErrorMessage(false);
                }}
                style={{ backgroundColor: "#5f5dbb" }}
                className=" px-6 py-3"
              >
                OK
              </button>
            </>
          }
        >
          <p>{joinErrorMessage}</p>
        </SweetAlert>
      ) : null}

      <div className={`rounded nft_card_container`}>
        <a
          href={`https://wax.atomichub.io/explorer/asset/${assetId}`}
          target="_blank"
          rel="noreferrer"
        >
          {!isVideo ? (
            <>
              <Image
                height={110}
                width={"100%"}
                loading="lazy"
                src={nftSrc}
                objectFit={"fill"}
                layout={"responsive"}
              />
            </>
          ) : (
            <div className="video_card_container">
              <video
                width={"100%"}
                className="video_nft object-cover"
                autoPlay
                muted
                controls=""
              >
                <source src={`${videoNftUrl}`} type="video/mp4" />
                <source src={`${videoNftUrl}`} type="video/ogg" />
              </video>
            </div>
          )}
        </a>

        <div className="nft_card_content_container text-center">
          <h2 className="nft_card_campaign_id">Campaign Id: {campaignId}</h2>
          <p className="text-white nft_card_autho_name">by {creator}</p>

          <div className="nft_card_content_time_container text-white mx-1">
            {timeToShow != "Reveal Winner" && (
              <p className="time_to_role_text">Time to Roll</p>
            )}

            <button
              className={`${
                timeToShow == "Reveal Winner"
                  ? "pointer-events-auto"
                  : "pointer-events-none"
              }`}
              onClick={() => {
                let counter = 16;
                setInterval(function () {
                  counter--;
                  if (counter >= 0) {
                    setTimeCountDown(counter);
                  }
                  if (counter === 0) {
                    clearInterval(counter);
                    setTimeCountDown(0);
                  }
                }, 1000);
                setShowWinner(true);
              }}
            >
              <h1 className="nft_card_content_time">{timeToShow}</h1>
            </button>
          </div>

          <p className="total_entries_container text-white font-normal">
            ✔ Total Entries: {totalEntriesStart}/{totalEntriesEnd}
          </p>

          <p className="entry_cost_container text-white font-normal">
            ✔ Entry Cost: {entryCost}
          </p>

          <button
            onClick={() => {
              userAccount ? setShowAlert(true) : setUserLoginPopup(true);
            }}
            className={`my-2.5 ${
              timeToShow == "Reveal Winner"
                ? "bg-zinc-500 py-2 px-2 rounded-md text-white pointer-events-none"
                : "join_campaign_now_btn"
            }`}
          >
            {timeToShow == "Reveal Winner" ? "ENDED" : "JOIN NOW"}
          </button>
          <div className="entrants_container cursor-pointer">
            <p className="entrants_counter font-semibold py-2.5">Entrants</p>

            {joinedAccounts?.length > 0 ? (
              joinedAccounts.map((item, index) => {
                return (
                  <p
                    key={index}
                    className="py-2 my-2 hidden entrants_indicator rounded text-white"
                  >
                    {item}
                  </p>
                );
              })
            ) : (
              <p className="py-2 hidden entrants_indicator rounded text-white">
                No Entrants So Far
              </p>
            )}
          </div>
        </div>
      </div>
      {showWinner && (
        <GetWinnerWhenExpired
          campaignIdToFindWith={campaignId}
          assetIdToFindWith={assetId}
          openModal={openModal}
          timeCountDown={timeCountDown}
          handleClose={() => {
            setShowWinner(false);
          }}
        />
      )}
    </>
  );
};

export default NftCard;
