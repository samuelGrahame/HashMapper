using Bridge;
using Bridge.Html5;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HashMapper
{
    public class MapInfo
    {
        private string _hash;
        public string Hash => _hash;

        public Action<MapInfo> OnNavigated { get; set; }
        public Action<MapInfo> OnLeft { get; set; }

        public static List<MapInfo> Mappings = new List<MapInfo>();
        public static bool AutoAdd = false;
        public MapInfo(string hash, Action<MapInfo> onNavigated, Action<MapInfo> onLeft)
        {
            _hash = hash;
            OnNavigated = onNavigated;
            OnLeft = onLeft;

            if(Mappings == null)
            {
                Mappings = new List<MapInfo>();
            }
            if(AutoAdd)
            {
                if (!Mappings.Contains(this))
                {
                    Mappings.Add(this);
                }
            }            
        }

        public MapInfo(string hash, Action<MapInfo> onNavigated) : this(hash, onNavigated, null)
        {
            
        }

        private static string PreviousHashLocation;
        private static string CurrentHashLocation;
        private static List<MapInfo> PreviousRanMapInfos = new List<MapInfo>();
        public static string HashSeperator = "-";

        public static void InvokeByHashCode()
        {
            CurrentHashLocation = Window.Location.Hash;
            if (CurrentHashLocation.StartsWith("#"))
                CurrentHashLocation = CurrentHashLocation.Substring(1);

            var currentRunningMapInfos = new List<MapInfo>();

            string[] hashs = CurrentHashLocation.Split(HashSeperator);

            int i;
            int y;
            int hashLength = hashs.Length;
            int mapLength = Mappings.Count;

            for (y = 0; y < mapLength; y++)
            {
                for (i = 0; i < hashLength; i++)
                {
                    try
                    {
                        if (Mappings[y]._hash.StartsWith("#"))
                            Mappings[y]._hash = Mappings[y]._hash.Substring(1);
                        if (Mappings[y]._hash == hashs[i])
                        {
                            var map = Mappings[y];
                            if (!PreviousRanMapInfos.Contains(map))
                            {
                                if (map.OnNavigated != null)
                                    map.OnNavigated(map);
                            }
                            currentRunningMapInfos.Add(map);
                            break;
                        }
                    }
                    catch (Exception) { }
                }
            }

            foreach (var item in PreviousRanMapInfos)
            {
                if (!currentRunningMapInfos.Contains(item))
                {
                    if (item.OnLeft != null)
                        item.OnLeft(item);
                }
            }

            PreviousRanMapInfos = currentRunningMapInfos;
            PreviousHashLocation = Window.Location.Hash;
        }

        [Init(InitPosition.Top)]
        public static void Setup()
        {
            Window.OnHashChange = (ev) =>
            {
                InvokeByHashCode();
            };
        }
    }
}
