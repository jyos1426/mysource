export const protocols = [
  { value: 0, text: 'HOPOPT' },
  { value: 1, text: 'ICMP' },
  { value: 2, text: 'IGMP' },
  { value: 3, text: 'GGP' },
  { value: 4, text: 'IP' },
  { value: 5, text: 'ST' },
  { value: 6, text: 'TCP' },
  { value: 8, text: 'EGP' },
  { value: 9, text: 'IGP' },
  { value: 12, text: 'PUP' },
  { value: 17, text: 'UDP' },
  { value: 20, text: 'HMP' },
  { value: 22, text: 'XNS-IDP' },
  { value: 27, text: 'RDP' },
  { value: 29, text: 'ISO-TP4' },
  { value: 36, text: 'XTP' },
  { value: 37, text: 'DDP' },
  { value: 38, text: 'IDRP-CMTP' },
  { value: 43, text: 'IPv6-Route' },
  { value: 44, text: 'IPv6-Frag' },
  { value: 45, text: 'IDRP' },
  { value: 46, text: 'RSVP' },
  { value: 47, text: 'GRE' },
  { value: 48, text: 'ESP' },
  { value: 51, text: 'AH' },
  { value: 57, text: 'SKIP' },
  { value: 58, text: 'IPv6-ICMP' },
  { value: 59, text: 'IPv6-NoNxt' },
  { value: 60, text: 'IPv6-Opts' },
  { value: 73, text: 'CPHB' },
  { value: 81, text: 'VMTP' },
  { value: 88, text: 'EIGRP' },
  { value: 89, text: 'OSPFIGP' },
  { value: 93, text: 'AX.25' },
  { value: 94, text: 'IPIP' },
  { value: 97, text: 'ETHERIP' },
  { value: 98, text: 'ENCAP' },
  { value: 103, text: 'PIM' },
  { value: 108, text: 'IPComp' },
  { value: 112, text: 'VRRP' },
  { value: 115, text: 'L2TP' },
  { value: 124, text: 'ISIS' },
  { value: 132, text: 'SCTP' },
  { value: 133, text: 'FC' },
];

export const icmpTypes = [
  { value: 0, text: 'Echo Reply' },
  { value: 3, text: 'Destination Unreachable' },
  { value: 4, text: 'Source Quench' },
  { value: 5, text: 'Redirect' },
  { value: 6, text: 'Alternate Host Address' },
  { value: 8, text: 'Echo' },
  { value: 9, text: 'Router Advertisement' },
  { value: 10, text: 'Router Selection' },
  { value: 11, text: 'Time Exceeded' },
  { value: 12, text: 'Parameter Problem' },
  { value: 13, text: 'Timestamp' },
  { value: 14, text: 'Timestamp Reply' },
  { value: 15, text: 'Information Request' },
  { value: 16, text: 'Information Reply' },
  { value: 17, text: 'Address Mask Request' },
  { value: 18, text: 'Address Mask Reply' },
  { value: 30, text: 'Traceroute' },
  { value: 31, text: 'Datagram Conversion Error' },
  { value: 32, text: 'Mobile Host Redirect' },
  { value: 33, text: 'IPv6 Where-Are-You' },
  { value: 34, text: 'IPv6 I-Am-Here' },
  { value: 35, text: 'Mobile Registration Request' },
  { value: 36, text: 'Mobile Registration Reply' },
  { value: 39, text: 'SKIP' },
  { value: 40, text: 'Photuri' }
];

export const icmpV6Types = [
  { value: 1, text: 'Destination Unreachable' },
  { value: 2, text: 'Packet Too Big' },
  { value: 3, text: 'Time Exceeded' },
  { value: 4, text: 'Parameter Problem' },
  { value: 128, text: 'Echo Request' },
  { value: 129, text: 'Echo Reply' },
  { value: 130, text: 'Multicast Listener Query' },
  { value: 131, text: 'Multicast Listener Report' },
  { value: 132, text: 'Multicast Listener Done' },
  { value: 133, text: 'Router Solicitation (NDP)' },
  { value: 134, text: 'Router Advertisement (NDP)' },
  { value: 135, text: 'Neighbor Solicitation (NDP)' },
  { value: 136, text: 'Neighbor Advertisement (NDP)' },
  { value: 137, text: 'Redirect Message (NDP)' },
  { value: 138, text: 'Router Renumbering' },
  { value: 139, text: 'ICMP Node Information Query' },
  { value: 140, text: 'ICMP Node Information Response' },
  { value: 141, text: 'Inverse Neighbor Discovery Solicitation Message' },
  { value: 142, text: 'Inverse Neighbor Discovery Advertisement Message' }
];

/**
 * ICMP Codes ( No Code )
 */
export const icmpNoCode = [
  { value: 0, text: 'No Code' }
];

/**
 * ICMP Codes ( 3: Destination Unreachable )
 */
export const icmpCodesDestinationUnreachable = [
  { value: 0, text: 'Network Unreachable' },
  { value: 1, text: 'Host Unreachable' },
  { value: 2, text: 'Protocol Unreachable' },
  { value: 3, text: 'Port Unreachable' },
  { value: 4, text: 'Fragmentation Needed and Dont Fragment was Set' },
  { value: 5, text: 'Source Route Failed' },
  { value: 6, text: 'Destination Network Unknown' },
  { value: 7, text: 'Destination Host Unknown' },
  { value: 8, text: 'Source Host Isolated' },
  { value: 9, text: 'Communication with Destination Network is Administratively Prohibited' },
  { value: 10, text: 'Communication with Destination Host is Administratively Prohibited' },
  { value: 11, text: 'Destination Network Unreachable for Type of Service' },
  { value: 12, text: 'Destination Host Unreachable for Type of Service' },
  { value: 13, text: 'Communication Administratively Prohibited' },
  { value: 14, text: 'Host Precedence Violation' },
  { value: 15, text: 'Precedence cutoff in effect' }
];

/**
 * ICMP Codes ( 5: Redirect )
 */
export const icmpCodesRedirect = [
  { value: 0, text: 'Redirect Datagrams for the Network' },
  { value: 1, text: 'Redirect Datagrams for the Host' },
  { value: 2, text: 'Redirect Datagrams for the Type of Service and Network' },
  { value: 3, text: 'Redirect Datagrams for the Type of Service and Host' }
];

/**
 * ICMP Codes ( 6: Alternate Host Address )
 */
export const icmpCodesAlternateHostAddress = [
  { value: 0, text: 'Alternate Address for Host' }
];

/**
 * ICMP Codes ( 9: Router Advertisement )
 */
export const icmpCodesRouterAdvertisement = [
  { value: 0, text: 'Normal router advertisement' },
  { value: 16, text: 'Does not route common traffic' }
];

/**
 * ICMP Codes ( 11: Time Exceeded )
 */
export const icmpCodesTimeExceeded = [
  { value: 0, text: 'Time to Live exceeded in Transit' },
  { value: 1, text: 'Fragment Reassemply Time Exceeded' }
];

/**
 * ICMP Codes ( 13: Timestamp )
 */
export const icmpCodesTimestamp = [
  { value: 0, text: 'Pointer indicates the error' },
  { value: 1, text: 'Missing a Required Option' },
  { value: 2, text: 'Bad Length' }
];

/**
 * ICMP Codes ( 40: Photuri )
 */
export const icmpCodesPhoturi = [
  { value: 0, text: 'Bad SPI' },
  { value: 1, text: 'Authentication Failed' },
  { value: 2, text: 'Decompression Failed' },
  { value: 3, text: 'Decryption Failed' },
  { value: 4, text: 'Need Authentication' },
  { value: 5, text: 'Need Authorization' }
];

/**
 * ICMP V6 Codes ( 1: Destination Unreachable )
 */
export const icmpV6CodesDetinationUnreachable = [
  { value: 0, text: 'no route to destination' },
  { value: 1, text: 'communication with destination administratively prohibited' },
  { value: 2, text: 'beyond scope of source address' },
  { value: 3, text: 'address unreachable' },
  { value: 4, text: 'port unreachable' },
  { value: 5, text: 'source address failed ingress/egress policy' },
  { value: 6, text: 'reject route to destination' },
  { value: 7, text: 'Error in Source Routing Header' }
];

/**
 * ICMP V6 Codes ( 3: Time Exceeded )
 */
export const icmpV6CodesTimeExceeded = [
  { value: 0, text: 'hop limit exceeded in transit' },
  { value: 1, text: 'fragment reassembly time exceeded' }
];

/**
 * ICMP V6 Codes ( 4: Parameter Problem )
 */
export const icmpV6CodesParameterProblem = [
  { value: 0, text: 'erroneous header field encountered' },
  { value: 1, text: 'unrecognized Next Header type encountered' },
  { value: 2, text: 'unrecognized IPv6 option encountered' }
];

/**
 * ICMP V6 Codes ( 138: Router Renumbering )
 */
export const icmpV6CodesRouterRenumbering = [
  { value: 0, text: 'Router Renumbering Command' },
  { value: 1, text: 'Router Renumbering Result' },
  { value: 255, text: 'Sequence Number Reset' }
];

/**
 * ICMP V6 Codes ( 139: ICMP Node Information Query )
 */
export const icmpV6CodesICMPNodeInformationQuery = [
  { value: 0, text: 'The Data field contains an IPv6 address which is the Subject of this Query.' },
  { value: 1, text: 'The Data field contains a name which is the Subject of this Query or is empty as in the case of a NOOP.' },
  { value: 2, text: 'The Data field contains an IPv4 address which is the Subject of this Query.' }
];

/**
 * ICMP V6 Codes ( 140: ICMP Node Information Response )
 */
export const icmpV6CodesICMPNodeInformationResponse = [
  { value: 0, text: 'A successful reply. The Reply Data field may or may not be empty.' },
  { value: 1, text: 'The Responder refuses to supply the answer. The Reply Data field will be empty.' },
  { value: 2, text: 'The Qtype of the Query is unknown to the Responder. The Reply Data field will be empty.' }
];
