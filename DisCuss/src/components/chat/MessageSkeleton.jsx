const MessageSkeleton = () => {
    // Create an array of 6 items for skeleton messages
    const skeletonMessages = Array(4).fill(null);
  
    return (
      <div className="flex-1 overflow-y-auto  p-4 space-y-4 bg-black text-white">
        {skeletonMessages.map((_, idx) => (
          <div key={idx} className={`flex items-center gap-3 ${idx % 2 === 0 ? "justify-start" : "justify-end"}`}>
            {/* Avatar Skeleton */}
            {idx % 2 === 0 && (
              <div className="size-10 rounded-full bg-gray-800 animate-pulse" />
            )}
  
            <div className={`flex flex-col ${idx % 2 === 0 ? "items-start" : "items-end"}`}>
              {/* Name Skeleton */}
              <div className="h-4 w-16 bg-gray-700 rounded-md animate-pulse mb-1" />
  
              {/* Message Skeleton */}
              <div className="h-16 w-[200px] bg-gray-700 rounded-lg animate-pulse" />
            </div>
  
            {/* Avatar Skeleton for right-aligned messages */}
            {idx % 2 !== 0 && (
              <div className="size-10 rounded-full bg-gray-800 animate-pulse" />
            )}
          </div>
        ))}
      </div>
    );
  };
  
  export default MessageSkeleton;
  