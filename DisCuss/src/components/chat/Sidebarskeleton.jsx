import { FaUserFriends } from "react-icons/fa"; // Using react-icons

const SidebarSkeleton = () => {
  const skeletonContacts = Array(8).fill(null);

  return (
    <aside className="h-full w-20 lg:w-72 border-r border-gray-800 bg-black flex flex-col transition-all duration-200">
      {/* Header */}
      <div className="border-b border-gray-800 w-full p-5">
        <div className="flex items-center gap-2 text-gray-200">
          <FaUserFriends className="w-6 h-6 text-gray-400" />  
          <span className="font-medium hidden lg:block">Contacts</span>
        </div>
      </div>

      {/* Skeleton Contacts */}
      <div className="overflow-y-auto w-full py-3">
        {skeletonContacts.map((_, idx) => (
          <div key={idx} className="w-full p-3 flex items-center gap-3">
            {/* Avatar skeleton */}
            <div className="rounded-full bg-gray-700 w-10 h-10 animate-pulse"></div>
            <div className="flex flex-col flex-1">
              <div className="bg-gray-700 h-4 w-3/4 mb-1 animate-pulse"></div>
              <div className="bg-gray-700 h-3 w-1/2 animate-pulse"></div>
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
};

export default SidebarSkeleton;
