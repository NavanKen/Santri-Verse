import DashboardLayout from "@/components/layout/DashboardLayout/DashboardLayout";
import KategoriPelanggaran from "@/components/views/Musyrif/MasterData/Pelanggaran/KategoriPelanggaran/KategoriPelanggaran";

const KategoriPelanggaranPages = () => {
  return (
    <>
      <DashboardLayout type="musyrif">
        <KategoriPelanggaran />
      </DashboardLayout>
    </>
  );
};

export default KategoriPelanggaranPages;
