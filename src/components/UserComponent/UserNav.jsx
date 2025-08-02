import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  //   DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  EllipsisVertical,
  User,
  Settings,
  LogOut,
  MessageCircle,
  Loader2,
} from "lucide-react";
import { supabase } from "@/lib/supabase/supabaseClient";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const UserNav = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [userInfo, setUserInfo] = useState({});

  const navigate = useNavigate();
  const menuItem = [
    { label: "Profile", icon: User, href: "profile" },
    { label: "Chat", icon: MessageCircle, href: "chat" },
    { label: "Settings", icon: Settings, href: "settings" },
  ];

  const getUserProfile = async () => {
    const { data: userLogin } = await supabase.auth.getUser();
    const userId = userLogin.user.id;
    const userEmail = userLogin.user.email;

    const { data: userProfile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    const username = userProfile.username;
    setUserInfo({
      id: userId,
      username: username,
      email: userEmail,
      picture: userProfile.profile_picture,
      role: userProfile.role,
    });
  };

  useEffect(() => {
    getUserProfile();
  }, []);

  const handleLogout = async () => {
    const toastId = toast.loading("Mohon tunggu sebentar...");

    try {
      const { error } = await supabase.auth.signOut();

      if (error) throw error;

      toast.success("Berhasil Logout", {
        id: toastId,
      });
      navigate("/auth/login");
    } catch (error) {
      toast.error(error?.message || "Terjadi Kesalahan", {
        id: toastId,
      });
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="flex items-center w-full gap-2 cursor-pointer px-2 py-1 rounded-md hover:bg-muted transition">
            <Avatar className="h-8 w-8">
              <AvatarImage
                src={userInfo?.picture || "/profile-default.png"}
                alt={userInfo?.username || "User"}
              />
              <AvatarFallback
                className={!userInfo?.picture ? "bg-muted animate-pulse" : ""}
              >
                <img
                  src="/profile-default.png"
                  alt={userInfo?.username || "User"}
                  className="h-full w-full object-cover"
                />
              </AvatarFallback>
            </Avatar>

            <div className="grid text-left text-sm leading-tight">
              <span className="truncate font-medium">
                {userInfo?.username ? (
                  <span className="truncate font-medium">
                    {userInfo.username}
                  </span>
                ) : (
                  <div className="h-4 bg-muted rounded animate-pulse w-20 mb-2"></div>
                )}
              </span>
              <span className="text-muted-foreground truncate text-xs">
                {userInfo?.email ? (
                  <span className="truncate font-medium">{userInfo.email}</span>
                ) : (
                  <div className="h-3 bg-muted rounded animate-pulse w-24"></div>
                )}
              </span>
            </div>
            <EllipsisVertical className="ml-auto size-4" />
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage
                  src={userInfo?.picture || "/profile-default.png"}
                  alt={userInfo?.username || "User"}
                />
                <AvatarFallback
                  className={!userInfo?.picture ? "bg-muted animate-pulse" : ""}
                >
                  <img
                    src="/profile-default.png"
                    alt={userInfo?.username || "User"}
                    className="h-full w-full object-cover"
                  />
                </AvatarFallback>
              </Avatar>

              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">
                  {userInfo?.username ? (
                    <span className="truncate font-medium">
                      {userInfo.username}
                    </span>
                  ) : (
                    <div className="h-4 bg-muted rounded animate-pulse w-20"></div>
                  )}
                </p>

                <p className="text-xs leading-none text-muted-foreground">
                  {userInfo?.email ? (
                    <span className="truncate font-medium">
                      {userInfo.email}
                    </span>
                  ) : (
                    <div className="h-3 bg-muted rounded animate-pulse w-24"></div>
                  )}
                </p>
              </div>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            {menuItem.map((item, index) => (
              <Link
                key={index}
                to={`/${userInfo.role}/${item.href}/${userInfo.id}`}
              >
                <DropdownMenuItem
                  key={index}
                  className="flex items-center gap-2"
                >
                  <item.icon className="size-4" />
                  <span>{item.label}</span>
                </DropdownMenuItem>
              </Link>
            ))}
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => setOpenDialog(true)}
            className="flex items-center gap-2"
          >
            <LogOut />
            <span>Logout</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className={`sm:max-w-[500px]`}>
          <DialogHeader>
            <DialogTitle>Yakin ingin logout?</DialogTitle>
            <DialogDescription>
              Anda harus login menggunakan akun anda lagi jika ingin masuk
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setOpenDialog(false)}>
              Batal
            </Button>
            <Button variant="destructive" onClick={handleLogout}>
              Logout
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default UserNav;
