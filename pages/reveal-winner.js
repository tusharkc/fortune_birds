import { useContext } from "react";
import NftFilter from "../components/features/NftFilters/NftFilter";
import NftCard from "../components/features/NftSection/NftCard";
import useGetEndedCampaigns from "../components/firebase/useGetEndedCampaigns";
import AppLayout from "../components/layout/AppLayout";
import { NftContext } from "../context/NftContext";

const RevealWinner = () => {
  const { isLoadingData } = useContext(NftContext);

  const { endedCampaigns } = useGetEndedCampaigns();

  return (
    <>
      {isLoadingData ? (
        <div className="flex items-center justify-center h-screen w-screen">
          <img src="/media/logo" className="loader_img" />
        </div>
      ) : (
        <>
          <AppLayout>
            <div className="container my-20 mx-auto">
              <NftFilter />
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                {endedCampaigns?.length > 0
                  ? endedCampaigns
                      .map((item, index) => {
                        return (
                          <div key={index} className="grid-cols-4">
                            <NftCard {...item} />
                          </div>
                        );
                      })
                      .reverse()
                  : ""}
              </div>
            </div>
          </AppLayout>
        </>
      )}
    </>
  );
};

export default RevealWinner;
